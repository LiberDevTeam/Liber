import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import getUnixTime from 'date-fns/getUnixTime';
import { v4 as uuidv4 } from 'uuid';
import { getMessageFeedById } from '~/lib/db/message';
import { placeAdded, placeMessagesAdded } from '~/state/actionCreater';
import { Bot } from '~/state/bots/botsSlice';
import { tmpListingOn } from '~/state/bots/mock';
import { selectMe } from '~/state/me/meSlice';
import { addIpfsContent } from '~/state/p2p/ipfsContentsSlice';
import { connectToMessages } from '~/state/places/async-actions';
import { selectPlaceById } from '~/state/places/placesSlice';
import { Mention, Message } from '~/state/places/type';
import { AppDispatch, RootState } from '~/state/store';
import { User } from '~/state/users/type';
import { selectAllUsers } from '~/state/users/usersSlice';

const MODULE_NAME = 'placeMessages';

const messageContentRegex = /@(\S*)/gm;
const parseText = ({
  text,
  users,
  bots,
}: {
  text: string;
  users: User[];
  bots: Bot[];
}): Array<string | Mention> => {
  const matches = [...text.matchAll(messageContentRegex)];
  let pos = 0;
  const result: Array<string | Mention> = [];

  matches.forEach((match) => {
    const nextPos = (match.index as number) + match[0].length;
    if (pos !== match.index) {
      result.push(text.slice(pos, match.index));
    }

    // TODO: Use id for matching
    const user = users.find((user) => user.name === match[1]);
    if (user) {
      result.push({ userId: user?.id, name: match[1], bot: false });
      pos = nextPos;
    }

    const bot = bots.find((bot) => bot.name === match[1]);
    if (bot) {
      result.push({ userId: bot?.id, name: match[1], bot: true });
      pos = nextPos;
    }
  });

  if (pos !== text.length) {
    result.push(text.slice(pos, text.length));
  }

  return result;
};

function resolveBotFromContent(
  content: Array<string | Mention>,
  bots: Bot[]
): Bot[] {
  return (
    content.filter((value) => {
      if (typeof value === 'string' || value.bot === false) {
        return false;
      }
      return true;
    }) as Mention[]
  ).map((mention) => {
    return bots.find((bot) => bot.id === mention.userId);
  }) as Bot[];
}

const runBotWorker = (message: Message, botCode: string): Promise<string> => {
  const worker = new Worker('/worker.js');
  return new Promise((resolve, reject) => {
    worker.onmessage = ({ data }) => {
      resolve(data);
    };
    worker.onerror = (e) => {
      reject(e);
    };
    worker.postMessage([message, botCode]);
  });
};

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
    // TODO: select bots for the place
    const purchasedBots = tmpListingOn;

    if (!place) {
      throw new Error(`Place (id: ${placeId}) is not exists.`);
    }

    const content = parseText({ text, users, bots: purchasedBots });

    const message: Message = {
      id: uuidv4(),
      authorName: me.name,
      uid: me.id,
      text,
      content,
      timestamp: getUnixTime(new Date()),
      mentions: [],
      bot: false,
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

    const bots = resolveBotFromContent(content, purchasedBots);
    bots.forEach(async (bot) => {
      const result = await runBotWorker(message, bot.sourceCode);
      if (result) {
        feed.add({
          id: uuidv4(),
          authorName: bot.name,
          uid: bot.id,
          text: result,
          content: [result],
          mentions: [],
          timestamp: getUnixTime(new Date()),
          bot: true,
        });
      }
    });
  }
);

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
