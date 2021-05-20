import { createAsyncThunk } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import getUnixTime from 'date-fns/getUnixTime';
import { v4 as uuidv4 } from 'uuid';
import { Place, PlacePermission } from '~/state/ducks/places/type';
import {
  connectMessageFeed,
  createMessageFeed,
  getMessageFeedById,
  readMessagesFromFeed,
} from '../../../lib/db/message';
import { createPlaceKeyValue } from '../../../lib/db/place';
import {
  placeAdded,
  placeMessageAdded,
  placeMessagesAdded,
} from '../../../state/actionCreater';
import { selectMe } from '../../../state/ducks/me/meSlice';
import { addIpfsContent } from '../../../state/ducks/p2p/ipfsContentsSlice';
import {
  connectToMessages,
  Message,
} from '../../../state/ducks/places/messagesSlice';
import {
  joinPlace,
  selectAllPlaces,
  selectPlaceById,
  setHash,
} from '../../../state/ducks/places/placesSlice';
import { AppDispatch, AppThunkDispatch, RootState } from '../../../state/store';
import { finishInitialization } from '../isInitialized';
async function digestMessage(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

const excludeMyMessages = (uid: string, messages: Message[]): Message[] => {
  return messages.filter((m) => m.uid !== uid);
};

const createMessageReceiveHandler = ({
  dispatch,
  placeId,
  myId,
}: {
  dispatch: AppThunkDispatch;
  placeId: string;
  myId: string;
}) => (messages: Message[]): void => {
  dispatch(
    placeMessagesAdded({
      placeId,
      messages: excludeMyMessages(myId, messages),
    })
  );
};

export const initApp = createAsyncThunk<
  void,
  void,
  { dispatch: AppThunkDispatch; state: RootState }
>('p2p/initApp', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const dispatch = thunkAPI.dispatch;

  selectAllPlaces(state).forEach(async (place) => {
    await dispatch(
      joinPlace({ placeId: place.id, address: place.keyValAddress })
    );
    if (place.passwordRequired && place.hash === undefined) {
      return;
    }
    dispatch(
      connectToMessages({ placeId: place.id, address: place.feedAddress })
    );
  });

  dispatch(finishInitialization());
});

export const publishPlaceMessage = createAsyncThunk<
  void,
  { text: string; pid: string; attachments?: File[] },
  { dispatch: AppDispatch; state: RootState }
>(
  'p2p/publishPlaceMessage',
  async ({ pid, text, attachments }, { dispatch, getState }) => {
    const state = getState();
    const place = selectPlaceById(pid)(state);
    const me = selectMe(state);

    if (!place) {
      throw new Error(`Place (id: ${pid}) is not exists.`);
    }

    const message: Message = {
      id: uuidv4(),
      authorName: me.username,
      uid: me.id,
      text,
      timestamp: getUnixTime(new Date()),
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
    dispatch(placeMessageAdded({ pid, message, mine: true }));
  }
);

export const openProtectedPlace = createAsyncThunk<
  void,
  { placeId: string; password: string },
  { dispatch: AppThunkDispatch; state: RootState }
>(
  'place/openProtectedPlace',
  async ({ placeId, password }, { dispatch, getState }) => {
    const state = getState();
    const me = state.me;
    const place = selectPlaceById(placeId)(state);

    if (!place) {
      throw new Error(`place: ${placeId} is not found.`);
    }

    const hash = await digestMessage(password);
    const feed = await connectMessageFeed({
      placeId,
      address: place.feedAddress,
      hash,
      onMessageAdd: createMessageReceiveHandler({
        dispatch,
        placeId,
        myId: me.id,
      }),
    });

    const messages = readMessagesFromFeed(feed);
    dispatch(setHash({ placeId, hash }));
    dispatch(placeMessagesAdded({ placeId, messages }));
    dispatch(
      publishPlaceMessage({
        pid: placeId,
        text: `${me.username || me.id} joined!`,
        attachments: [],
      })
    );
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
      onMessageAdd: createMessageReceiveHandler({
        dispatch,
        placeId,
        myId: me.id,
      }),
    });

    const timestamp = getUnixTime(new Date());
    const invitationUrl = await buildInvitationUrl(
      placeId,
      placeKeyValue.address.root
    );

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
      invitationUrl: invitationUrl,
      passwordRequired,
      hash,
      category,
      messageIds: [],
      unreadMessages: [],
      readOnly,
      permissions: { [me.id]: PlacePermission.AUTHOR },
      bannedUsers: [],
    };

    Object.keys(place).forEach((key) => {
      if (key === 'hash') return; // Do not add hash to the place db.
      const v = place[key as keyof Place];
      v && placeKeyValue.put(key, v);
    });

    dispatch(placeAdded({ place, messages: [] }));
    dispatch(push(`/places/${placeId}`));
  }
);

const buildInvitationUrl = async (placeId: string, address: string) => {
  return `${window.location.protocol}//${window.location.host}/#/places/${placeId}/join/${address}`;
};
