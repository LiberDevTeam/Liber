import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { connectMessageFeed, readMessagesFromFeed } from '~/lib/db/message';
import {
  placeAdded,
  placeMessageAdded,
  placeMessagesAdded,
} from '~/state/actionCreater';

const MODULE_NAME = 'placeMessages';

export interface Message {
  id: string; // UUID
  uid: string;
  authorName?: string;
  timestamp: number;
  text?: string;
  attachmentCidList?: string[];
}

export const connectToMessages = createAsyncThunk<
  Message[],
  { placeId: string; address: string; hash?: string }
>(
  `${MODULE_NAME}/connectToMessages`,
  async ({ placeId, address, hash }, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const feed = await connectMessageFeed({
      placeId,
      address,
      hash,
      onMessageAdd: (messages) => {
        dispatch(placeMessagesAdded({ messages, placeId }));
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
      .addCase(placeMessageAdded, (state, action) => {
        messagesAdapter.addOne(state, action.payload.message);
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
