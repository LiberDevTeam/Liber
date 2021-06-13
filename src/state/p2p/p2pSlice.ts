import { createAsyncThunk } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import getUnixTime from 'date-fns/getUnixTime';
import { v4 as uuidv4 } from 'uuid';
import { createMessageFeed, getMessageFeedById } from '~/lib/db/message';
import { createPlaceKeyValue } from '~/lib/db/place';
import { placeAdded, placeMessagesAdded } from '~/state/actionCreater';
import { selectMe } from '~/state/me/meSlice';
import { addIpfsContent } from '~/state/p2p/ipfsContentsSlice';
import {
  connectToMessages,
  Mention,
  Message,
} from '~/state/places/messagesSlice';
import { joinPlace, selectPlaceById } from '~/state/places/placesSlice';
import { Place, PlacePermission } from '~/state/places/type';
import { AppDispatch, AppThunkDispatch, RootState } from '~/state/store';
import { User } from '~/state/users/type';
import { selectAllUsers } from '~/state/users/usersSlice';
import { digestMessage } from '~/utils/digest-message';
import { finishInitialization } from '../isInitialized';

const excludeMyMessages = (uid: string, messages: Message[]): Message[] => {
  return messages.filter((m) => m.uid !== uid);
};

const createMessageReceiveHandler =
  ({
    dispatch,
    placeId,
    myId,
  }: {
    dispatch: AppThunkDispatch;
    placeId: string;
    myId: string;
  }) =>
  (messages: Message[]): void => {
    if (messages.length > 0) {
      dispatch(
        placeMessagesAdded({
          placeId,
          messages: excludeMyMessages(myId, messages),
        })
      );
    }
  };

export const initApp = createAsyncThunk<
  void,
  void,
  { dispatch: AppThunkDispatch; state: RootState }
>('p2p/initApp', async (_, { dispatch, getState }) => {
  const state = getState();
  await Promise.all(
    state.me.joinedPlaces.map(async ({ placeId, address }) => {
      await dispatch(joinPlace({ placeId, address }));
      const place = selectPlaceById(placeId)(state);
      if (place) {
        place.passwordRequired && place.hash === undefined
          ? undefined
          : await dispatch(
              connectToMessages({
                placeId: place.id,
                hash: place.hash,
                address: place.feedAddress,
              })
            );
      }
    })
  );

  dispatch(finishInitialization());
});

const messageContentRegex = /@(\S*)/gm;
const parseText = (text: string, users: User[]): Array<string | Mention> => {
  const matches = [...text.matchAll(messageContentRegex)];
  let pos = 0;
  const result: Array<string | Mention> = [];

  matches.forEach((match) => {
    const nextPos = (match.index as number) + match[0].length;
    if (pos !== match.index) {
      result.push(text.slice(pos, match.index));
    }

    const user = users.find((user) => user.username === match[1]);
    result.push({ userId: user?.id, name: match[1] });
    pos = nextPos;
  });

  if (pos !== text.length) {
    result.push(text.slice(pos, text.length));
  }

  return result;
};

export const publishPlaceMessage = createAsyncThunk<
  void,
  { text: string; placeId: string; attachments?: File[] },
  { dispatch: AppDispatch; state: RootState }
>(
  'p2p/publishPlaceMessage',
  async ({ placeId, text, attachments }, { dispatch, getState }) => {
    const state = getState();
    const place = selectPlaceById(placeId)(state);
    const users = selectAllUsers(state.users);
    const me = selectMe(state);

    if (!place) {
      throw new Error(`Place (id: ${placeId}) is not exists.`);
    }

    const message: Message = {
      id: uuidv4(),
      authorName: me.username,
      uid: me.id,
      text,
      content: parseText(text, users),
      timestamp: getUnixTime(new Date()),
      mentions: [],
    };

    if (attachments) {
      message.attachmentCidList =
        (await Promise.all(
          attachments.map(async (file) => {
            return await addIpfsContent(dispatch, file);
          })
        )) || [];
    }

    const feed = getMessageFeedById(place.id);
    if (feed === undefined) {
      throw new Error(`messages DB is not exists.`);
    }

    await feed.add(message);
  }
);

export const createNewPlace = createAsyncThunk<
  void,
  {
    name: string;
    category: number;
    description: string;
    isPrivate: boolean;
    avatar: File;
    password: string;
    readOnly: boolean;
  },
  { dispatch: AppDispatch; state: RootState }
>(
  'p2p/createNewPlace',
  async (
    { name, description, isPrivate, avatar, password, category, readOnly },
    { dispatch, getState }
  ) => {
    const { me } = getState();

    const cid = await addIpfsContent(dispatch, avatar);

    let swarmKey;
    if (isPrivate) {
      // TODO private swarm
      // const swarmKey = uuidv4()
      // p2pNodes.privateIpfsNodes[id] = await IPFS.create({})
    }

    const placeId = uuidv4();
    const passwordRequired = !!password;
    const placeKeyValue = await createPlaceKeyValue(placeId);
    const hash = password ? await digestMessage(password) : undefined;
    const feed = await createMessageFeed({
      placeId,
      hash,
      onReceiveEvent: createMessageReceiveHandler({
        dispatch,
        placeId,
        myId: me.id,
      }),
    });

    const timestamp = getUnixTime(new Date());

    const place: Place = {
      id: placeId,
      keyValAddress: placeKeyValue.address.root,
      feedAddress: feed.address.root,
      name,
      description,
      avatarCid: cid,
      timestamp: timestamp,
      createdAt: timestamp,
      swarmKey: swarmKey || undefined,
      passwordRequired,
      hash,
      category,
      messageIds: [],
      unreadMessages: [],
      readOnly,
      permissions: { [me.id]: PlacePermission.AUTHOR },
      bannedUsers: [],
    };

    await Promise.all(
      Object.keys(place).map((key) => {
        if (key === 'hash') {
          Promise.resolve(); // Do not add hash to the place db.
        }
        const v = place[key as keyof Place];
        if (v === undefined) {
          return Promise.resolve();
        }
        return placeKeyValue.put(key, v);
      })
    );

    dispatch(placeAdded({ place, messages: [] }));
    dispatch(push(`/places/${placeKeyValue.address.root}/${placeId}`));
  }
);
