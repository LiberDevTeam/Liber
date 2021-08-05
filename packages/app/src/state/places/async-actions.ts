import { createAsyncThunk } from '@reduxjs/toolkit';
import { getPlaceDB } from '~/lib/db/place';
import { placeMessagesAdded } from '~/state/actionCreator';
import { selectMe } from '~/state/me/meSlice';
import { Message, ReactionMap } from '~/state/places/type';
import { RootState, ThunkExtra } from '~/state/store';

export const connectToMessages = createAsyncThunk<
  Message[],
  { placeId: string; address: string; hash?: string },
  { state: RootState; extra: ThunkExtra }
>(
  'placeMessages/connectToMessages',
  async ({ placeId, address, hash }, { dispatch, extra }) => {
    const feed = await extra.db.message.connect({
      placeId,
      address,
      hash,
      onReceiveEvent: (messages) => {
        if (messages.length > 0) {
          dispatch(placeMessagesAdded({ messages, placeId }));
        }
      },
    });

    return extra.db.message.read(feed);
  }
);

export const addReaction = createAsyncThunk<
  ReactionMap,
  { placeId: string; messageId: string; emojiId: string },
  { state: RootState }
>(
  'placeMessages/addReaction',
  async ({ placeId, messageId, emojiId }, { getState }) => {
    const state = getState();
    const me = selectMe(state);
    const db = getPlaceDB(placeId);

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
