import { createAsyncThunk } from '@reduxjs/toolkit';
import getUnixTime from 'date-fns/getUnixTime';
import { v4 as uuidv4 } from 'uuid';
import { addDBEventHandler } from '~/lib/db/utils';
import { placeMessagesAdded, placeUpdated } from '~/state/actionCreator';
import { appendJoinedPlace, selectMe } from '~/state/me/meSlice';
import { PlacePK } from '~/state/me/type';
import { Message, ReactionMap, SystemMessageType } from '~/state/places/type';
import { checkPlaceValues } from '~/state/places/utils';
import { AppDispatch, RootState, ThunkExtra } from '~/state/store';

export const sendJoinedMessage = createAsyncThunk<
  void,
  { placeId: string; uid: string },
  { dispatch: AppDispatch; state: RootState; extra: ThunkExtra }
>('placeMessages/sendJoinedMessage', async ({ placeId, uid }, { extra }) => {
  const messageFeed = extra.db.message.get(placeId);

  if (messageFeed === undefined) {
    throw new Error(`messages DB is not exists.`);
  }

  await messageFeed.add({
    type: SystemMessageType.JOIN,
    uid,
    id: uuidv4(),
    timestamp: getUnixTime(new Date()),
  });
});

export const connectToMessages = createAsyncThunk<
  Message[],
  { placeId: string; address: string; hash: string | null },
  { state: RootState; extra: ThunkExtra }
>(
  'placeMessages/connectToMessages',
  async ({ placeId, address, hash }, { dispatch, extra, getState }) => {
    const { me } = getState();
    const feed = await extra.db.message.connect({
      placeId,
      address,
      hash,
    });

    addDBEventHandler(feed, () => {
      const messages = extra.db.message.read(feed);
      if (messages.length > 0) {
        dispatch(placeMessagesAdded({ messages, placeId }));
      }
    });

    if (!me.joinedPlaces.find((p) => p.placeId === placeId)) {
      // first connect
      dispatch(sendJoinedMessage({ placeId, uid: me.id }));
    }

    return extra.db.message.read(feed);
  }
);

export const addReaction = createAsyncThunk<
  ReactionMap,
  { placeId: string; messageId: string; emojiId: string },
  { state: RootState; extra: ThunkExtra }
>(
  'placeMessages/addReaction',
  async ({ placeId, messageId, emojiId }, { getState, extra }) => {
    const state = getState();
    const me = selectMe(state);
    const db = extra.db.place.get(placeId);

    if (!db) {
      throw new Error('Cannot find place database');
    }

    const currentMap = db.get('reactions') as ReactionMap;
    let messageReactions = currentMap[messageId] || [];

    if (messageReactions.find((r) => r.emojiId === emojiId)) {
      messageReactions = messageReactions.map((r) => {
        if (r.emojiId !== emojiId) {
          return r;
        }

        // remove
        if (r.userIds.includes(me.id)) {
          return { emojiId, userIds: r.userIds.filter((id) => id !== me.id) };
        }

        // add
        return { emojiId, userIds: r.userIds.concat(me.id) };
      });
    } else {
      messageReactions = messageReactions.concat({ emojiId, userIds: [me.id] });
    }

    const newMap = {
      ...currentMap,
      [messageId]: messageReactions.filter((r) => r.userIds.length > 0),
    };

    await db.put('reactions', newMap);

    return newMap;
  }
);

export const joinPlace = createAsyncThunk<
  void,
  PlacePK,
  { dispatch: AppDispatch; extra: ThunkExtra; state: RootState }
>(
  'placeMessages/join',
  async ({ placeId, address }, { dispatch, extra, getState }) => {
    const { me } = getState();
    const kv = await extra.db.place.connect({
      placeId,
      address,
      onReplicated: (_kv) => {
        const place = extra.db.place.read(_kv);
        if (checkPlaceValues(place)) {
          dispatch(placeUpdated(place));
        }
      },
    });

    const place = extra.db.place.read(kv);

    if (!checkPlaceValues(place)) {
      return;
    }

    dispatch(
      connectToMessages({
        placeId: place.id,
        hash: place.hash,
        address: place.feedAddress,
      })
    );
    dispatch(placeUpdated(place));

    if (
      !me.joinedPlaces.find(
        (p) => p.placeId === place.id && p.address === place.keyValAddress
      )
    ) {
      // first join
      dispatch(
        appendJoinedPlace({ placeId: place.id, address: place.keyValAddress })
      );
    }
  }
);
