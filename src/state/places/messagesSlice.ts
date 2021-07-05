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
import { Bot, selectBotsByIds } from '~/state/bots/botsSlice';
import { selectMe } from '~/state/me/meSlice';
import { addIpfsContent } from '~/state/p2p/ipfsContentsSlice';
import { connectToMessages } from '~/state/places/async-actions';
import { selectPlaceById } from '~/state/places/placesSlice';
import { Mention, Message } from '~/state/places/type';
import { AppDispatch, RootState } from '~/state/store';
import { User } from '~/state/users/type';
import { selectAllUsers } from '~/state/users/usersSlice';
import { ItemType } from '../feed/feedSlice';

const MODULE_NAME = 'placeMessages';

const isBot = (target: Bot | User): target is Bot => {
  return 'sourceCode' in target;
};

const messageContentRegex = /@(\S*)/gm;
export const parseText = ({
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

  const mentionTarget: Array<Bot | User> = [...bots, ...users];

  matches.forEach((match) => {
    const nextPos = (match.index as number) + match[0].length;

    // TODO: Use id for matching
    const target = mentionTarget.find((user) => user.name === match[1]);
    if (target) {
      // Prevent adding empty string
      if (pos !== match.index) {
        result.push(text.slice(pos, match.index));
      }
      result.push({ userId: target?.id, name: match[1], bot: isBot(target) });
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

    if (!place) {
      throw new Error(`Place (id: ${placeId}) is not exists.`);
    }

    const placeBots = selectBotsByIds(place.bots)(state);

    const content = parseText({ text, users, bots: placeBots });

    const message: Message = {
      id: uuidv4(),
      authorName: me.name,
      uid: me.id,
      text,
      content,
      timestamp: getUnixTime(new Date()),
      mentions: [],
      bot: false,
      placeId: placeId,
      placeAddress: place.keyValAddress,
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

    const exploreMessageDB = await connectExploreMessageKeyValue();
    if (!place.swarmKey && !place.passwordRequired) {
      exploreMessageDB.put(
        `/places/${place.keyValAddress}/${place.id}/messages/${message.id}`,
        message
      );
    }

    const feedDB = await connectFeedDB();
    await feedDB.add({
      itemType: ItemType.MESSAGE,
      ...message,
    });

    const bots = resolveBotFromContent(content, placeBots);
    bots.forEach(async (bot) => {
      const result = await runBotWorker(message, bot.sourceCode);
      if (result) {
        const message = {
          id: uuidv4(),
          authorName: bot.name,
          uid: bot.id,
          text: result,
          content: [result],
          mentions: [],
          timestamp: getUnixTime(new Date()),
          bot: true,
          placeId: placeId,
          placeAddress: place.keyValAddress,
        };
        feed.add(message);
        if (!place.swarmKey && !place.passwordRequired) {
          exploreMessageDB.put(
            `/places/${place.keyValAddress}/${place.id}/messages/${message.id}`,
            message
          );
        }
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
