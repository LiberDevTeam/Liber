import { createAsyncThunk } from '@reduxjs/toolkit';
import getUnixTime from 'date-fns/getUnixTime';
import { v4 as uuidv4 } from 'uuid';
import { history } from '~/history';
import { connectExploreMessageKeyValue } from '~/lib/db/explore/message';
import { connectExplorePlaceKeyValue } from '~/lib/db/explore/place';
import { connectFeedDB } from '~/lib/db/feed';
import { connectMarketplaceBotNewKeyValue } from '~/lib/db/marketplace/bot/new';
import { connectMarketplaceStickerNewKeyValue } from '~/lib/db/marketplace/sticker/new';
import { createMessageFeed } from '~/lib/db/message';
import { createPlaceKeyValue } from '~/lib/db/place';
import {
  createExploreMessageSearchIndex,
  createExplorePlaceSearchIndex,
  createMarketplaceBotSearchIndex,
  createMarketplaceStickerSearchIndex,
} from '~/lib/search';
import { placeAdded, placeMessagesAdded } from '~/state/actionCreater';
import { addIpfsContent } from '~/state/p2p/ipfsContentsSlice';
import { connectToMessages } from '~/state/places/async-actions';
import { joinPlace, selectPlaceById } from '~/state/places/placesSlice';
import { Message, Place, PlacePermission } from '~/state/places/type';
import { AppDispatch, RootState } from '~/state/store';
import { digestMessage } from '~/utils/digest-message';
import { ItemType } from '../feed/feedSlice';
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
    dispatch: AppDispatch;
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
  { dispatch: AppDispatch; state: RootState }
>('p2p/initApp', async (_, { dispatch, getState }) => {
  const state = getState();
  await Promise.all(
    state.me.joinedPlaces.map(async ({ placeId, address }) => {
      await dispatch(joinPlace({ placeId, address }));
      const place = selectPlaceById(placeId)(state);
      if (place && place.passwordRequired && place.hash === undefined) {
        await dispatch(
          connectToMessages({
            placeId: place.id,
            hash: place.hash,
            address: place.feedAddress,
          })
        );
      }
    })
  );

  connectMarketplaceBotNewKeyValue().then((db) => {
    createMarketplaceBotSearchIndex(Object.values(db.all));
  });
  connectMarketplaceStickerNewKeyValue().then((db) => {
    createMarketplaceStickerSearchIndex(Object.values(db.all));
  });

  connectExplorePlaceKeyValue().then((db) => {
    createExplorePlaceSearchIndex(Object.values(db.all));
  });

  connectExploreMessageKeyValue().then((db) => {
    createExploreMessageSearchIndex(Object.values(db.all));
  });

  dispatch(finishInitialization());
});

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

    const cid = await addIpfsContent(avatar);

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
      bots: [],
      reactions: {},
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

    place.hash = undefined;
    const explorePlaceDB = await connectExplorePlaceKeyValue();
    const keystore = explorePlaceDB.identity.provider.keystore;
    await explorePlaceDB.put(
      `/${explorePlaceDB.identity.publicKey}/${place.keyValAddress}/${place.id}`,
      {
        signature: await keystore.sign(
          await keystore.getKey(explorePlaceDB.identity.id),
          JSON.stringify(place)
        ),
        ...place,
      }
    );

    connectFeedDB().then((db) => {
      db.add({
        itemType: ItemType.PLACE,
        ...place,
      });
    });

    history.push(`/places/${placeKeyValue.address.root}/${placeId}`);
  }
);
