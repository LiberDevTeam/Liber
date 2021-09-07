import { createAsyncThunk } from '@reduxjs/toolkit';
import getUnixTime from 'date-fns/getUnixTime';
import { v4 as uuidv4 } from 'uuid';
import { history } from '~/history';
import { addDBEventHandler, readAllFeedItems } from '~/lib/db/utils';
import {
  createExploreMessageSearchIndex,
  createExplorePlaceSearchIndex,
  createMarketplaceBotSearchIndex,
  createMarketplaceStickerSearchIndex,
} from '~/lib/search';
import { placeAdded, placeMessagesAdded } from '~/state/actionCreator';
import { addIpfsContent } from '~/state/p2p/ipfsContentsSlice';
import { joinPlace } from '~/state/places/async-actions';
import { Message, Place, PlacePermission } from '~/state/places/type';
import { isSystemMessage } from '~/state/places/utils';
import { AppDispatch, RootState, ThunkExtra } from '~/state/store';
import { digestMessage } from '~/utils/digest-message';
import { ItemType } from '../feed/feedSlice';
import { finishInitialization } from '../isInitialized';

const excludeMyMessages = (uid: string, messages: Message[]): Message[] => {
  return messages.filter((m) => {
    if (isSystemMessage(m)) {
      return false;
    } else {
      return m.uid !== uid;
    }
  });
};

export const initApp = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState; extra: ThunkExtra }
>('p2p/initApp', async (_, { dispatch, getState, extra }) => {
  const state = getState();
  await Promise.all(
    state.me.joinedPlaces.map(async ({ placeId, address }) => {
      dispatch(joinPlace({ placeId, address }));
    })
  );

  extra.db.marketplaceBotRanking.connect().then((db) => {
    createMarketplaceBotSearchIndex(Object.values(db.all));
  });

  extra.db.marketplaceStickerNew.connect().then((db) => {
    createMarketplaceStickerSearchIndex(Object.values(db.all));
  });

  extra.db.explorePlace.connect().then((db) => {
    createExplorePlaceSearchIndex(Object.values(db.all));
  });

  extra.db.exploreMessage.connect().then((db) => {
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
  { dispatch: AppDispatch; state: RootState; extra: ThunkExtra }
>(
  'p2p/createNewPlace',
  async (
    { name, description, isPrivate, avatar, password, category, readOnly },
    { dispatch, getState, extra }
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
    const placeKeyValue = await extra.db.place.create(placeId);
    const hash = password ? await digestMessage(password) : null;

    const feed = await extra.db.message.create({
      placeId,
      hash,
    });

    addDBEventHandler(feed, () => {
      const messages = excludeMyMessages(me.id, readAllFeedItems(feed));
      if (messages.length > 0) {
        dispatch(
          placeMessagesAdded({
            placeId,
            messages,
          })
        );
      }
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
      swarmKey: swarmKey || null,
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
        if (v === undefined || v === null) {
          return Promise.resolve();
        }
        return placeKeyValue.put(key, v);
      })
    );

    dispatch(placeAdded({ place, messages: [] }));

    place.hash = null;
    const explorePlaceDB = await extra.db.explorePlace.connect();
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

    extra.db.feed.connect().then((db) => {
      db.add({
        itemType: ItemType.PLACE,
        ...place,
      });
    });

    history.push(`/places/${placeKeyValue.address.root}/${placeId}`);
  }
);
