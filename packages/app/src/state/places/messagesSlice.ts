import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import getUnixTime from 'date-fns/getUnixTime';
import { v4 as uuidv4 } from 'uuid';
import { connectExploreMessageKeyValue } from '~/lib/db/explore/message';
import { connectFeedDB } from '~/lib/db/feed';
import { getMessageFeedById } from '~/lib/db/message';
import { placeAdded, placeMessagesAdded } from '~/state/actionCreater';
import { selectBotsByIds } from '~/state/bots/botsSlice';
import { selectMe } from '~/state/me/meSlice';
import { addIpfsContent } from '~/state/p2p/ipfsContentsSlice';
import { connectToMessages } from '~/state/places/async-actions';
import { selectPlaceById } from '~/state/places/placesSlice';
import { Message, Place, StickerItem } from '~/state/places/type';
import {
  parseText,
  resolveBotFromContent,
  runBotWorker,
} from '~/state/places/utils';
import { AppDispatch, RootState } from '~/state/store';
import { selectAllUsers } from '~/state/users/usersSlice';
import { ItemType } from '../feed/feedSlice';

const MODULE_NAME = 'placeMessages';

function createMessage(props: Omit<Message, 'id' | 'timestamp'>): Message {
  return {
    ...props,
    id: uuidv4(),
    timestamp: getUnixTime(new Date()),
  };
}

async function sendMessage(place: Place, message: Message) {
  const messageFeed = getMessageFeedById(place.id);
  const exploreMessageDB = await connectExploreMessageKeyValue();
  const feedDB = await connectFeedDB();

  if (messageFeed === undefined) {
    throw new Error(`messages DB is not exists.`);
  }

  await messageFeed.add(message);

  if (!place.swarmKey && !place.passwordRequired) {
    await exploreMessageDB.put(
      `/places/${place.keyValAddress}/${place.id}/messages/${message.id}`,
      message
    );
  }

  await feedDB.add({
    itemType: ItemType.MESSAGE,
    ...message,
  });
}

export const publishPlaceMessage = createAsyncThunk<
  void,
  { text: string; placeId: string; attachments?: File[] },
  { dispatch: AppDispatch; state: RootState }
>(
  `${MODULE_NAME}/publishPlaceMessage`,
  async ({ placeId, text, attachments }, { dispatch, getState }) => {
    const state = getState();
    const place = selectPlaceById(placeId)(state);
    const users = selectAllUsers(state.users);
    const me = selectMe(state);

    if (!place) {
      throw new Error(`Place (id: ${placeId}) is not exists.`);
    }

    const placeBots = selectBotsByIds(place.bots)(state);

    const content = parseText({ text, users, bots: placeBots });
    const message = createMessage({
      authorName: me.name,
      uid: me.id,
      text,
      content,
      placeId: placeId,
      placeAddress: place.keyValAddress,
      bot: false,
    });

    if (attachments) {
      message.attachmentCidList =
        (await Promise.all(
          attachments.map(async (file) => {
            return await addIpfsContent(file);
          })
        )) || [];
    }

    await sendMessage(place, message);

    const bots = resolveBotFromContent(content, placeBots);
    bots.forEach(async (bot) => {
      const result = await runBotWorker(message, bot.sourceCode);
      if (result) {
        sendMessage(
          place,
          createMessage({
            authorName: bot.name,
            uid: bot.id,
            text: result,
            content: [result],
            bot: true,
            placeId: placeId,
            placeAddress: place.keyValAddress,
          })
        );
      }
    });
  }
);

export const sendSticker = createAsyncThunk<
  void,
  { placeId: string; item: StickerItem },
  { dispatch: AppDispatch; state: RootState }
>(`${MODULE_NAME}/sendSticker`, async ({ placeId, item }, { getState }) => {
  const state = getState();
  const place = selectPlaceById(placeId)(state);
  const me = selectMe(state);

  if (!place) {
    throw new Error(`Place (id: ${placeId}) is not exists.`);
  }

  await sendMessage(
    place,
    createMessage({
      authorName: me.name,
      uid: me.id,
      content: [],
      placeId: placeId,
      placeAddress: place.keyValAddress,
      bot: false,
      sticker: item,
    })
  );
});

const messagesAdapter = createEntityAdapter<Message>({
  sortComparer: (a, b) => a.timestamp - b.timestamp,
});

export const messagesSlice = createSlice({
  name: MODULE_NAME,
  initialState: messagesAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeAdded, (state, action) => {
        messagesAdapter.upsertMany(state, action.payload.messages);
      })
      .addCase(placeMessagesAdded, (state, action) => {
        messagesAdapter.upsertMany(state, action.payload.messages);
      })
      .addCase(connectToMessages.fulfilled, (state, action) => {
        messagesAdapter.upsertMany(state, action.payload);
      });
  },
});

export const selectMessageById = messagesAdapter.getSelectors().selectById;

export default messagesSlice.reducer;