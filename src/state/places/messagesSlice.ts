import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { connectMessageFeed, readMessagesFromFeed } from '~/lib/db/message';
import { placeAdded, placeMessagesAdded } from '~/state/actionCreater';
import { RootState } from '~/state/store';

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
