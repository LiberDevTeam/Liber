import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { connectFeedDB } from '~/lib/db/feed';
import { AppDispatch, RootState } from '~/state/store';
import { Message, Place } from '../places/type';

export enum Appearance {
  DEFAULT,
  BIG_CARD,
}

export enum ItemType {
  MESSAGE,
  PLACE,
}

interface WithHash {
  feedHash: string;
}

interface FeedItemMessage extends Message, WithHash {
  itemType: ItemType.MESSAGE;
}

interface FeedItemPlace extends Place, WithHash {
  itemType: ItemType.PLACE;
}

export type FeedItem = FeedItemMessage | FeedItemPlace;

export interface FeedsState {
  loading: boolean;
  items: FeedItem[];
}

export const limit = 30;

export const fetchFeedItems = createAsyncThunk<
  FeedItem[],
  { hash: string } | void,
  { dispatch: AppDispatch; state: RootState }
>('feed/fetchFeedItems', async (args, { dispatch }) => {
  const db = await connectFeedDB();

  const options: { limit: number; lt?: string } = { limit };
  if (args) {
    options.lt = args.hash;
  }

  return db
    .iterator(options)
    .collect()
    .map((item) => ({ ...item.payload.value, feedHash: item.hash }));
});

const initialState: FeedsState = {
  loading: false,
  items: [],
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeedItems.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchFeedItems.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);

        state.items = state.items.concat(action.payload);
      });
  },
});

export const selectFeed = (state: RootState): FeedItem[] => state.feed.items;

export default feedSlice.reducer;
