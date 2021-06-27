import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import getUnixTime from 'date-fns/getUnixTime';
import { v4 as uuidv4 } from 'uuid';
import {
  connectMessageFeed,
  getMessageFeedById,
  readMessagesFromFeed,
} from '~/lib/db/message';
import { placeAdded, placeMessagesAdded } from '~/state/actionCreater';
import { selectMe } from '~/state/me/meSlice';
import { addIpfsContent } from '~/state/p2p/ipfsContentsSlice';
import { selectPlaceById } from '~/state/places/placesSlice';
import { AppDispatch, RootState } from '~/state/store';
import { User } from '~/state/users/type';
import { selectAllUsers } from '~/state/users/usersSlice';

const MODULE_NAME = 'placeMessages';

export interface Mention {
  userId?: string;
  name: string;
}

export interface Message {
  id: string; // UUID
  uid: string;
  authorName?: string;
  timestamp: number;
  text?: string;
  attachmentCidList?: string[];
  content: Array<string | Mention>;
  // mentioned user ids
  mentions: string[];
}

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
  `${MODULE_NAME}/publishPlaceMessage`,
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

export const connectToMessages = createAsyncThunk<
  Message[],
  { placeId: string; address: string; hash?: string },
  { state: RootState }
>(
  `${MODULE_NAME}/connectToMessages`,
  async ({ placeId, address, hash }, thunkAPI) => {
    const { dispatch } = thunkAPI;

    const feed = await connectMessageFeed({
      placeId,
      address,
      hash,
      onReceiveEvent: (messages) => {
        if (messages.length > 0) {
          dispatch(placeMessagesAdded({ messages, placeId }));
        }
      },
    });

    return readMessagesFromFeed(feed);
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
