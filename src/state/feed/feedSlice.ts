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
  hasNext: boolean;
  items: FeedItem[];
}

export const limit = 5;

export const fetchFeedItems = createAsyncThunk<
  FeedItem[],
  { hash: string } | void,
  { dispatch: AppDispatch; state: RootState }
>('feed/fetchFeedItems', async (args, { dispatch }) => {
  const db = await connectFeedDB();

  return db
    .iterator({
      limit,
      lt: args?.hash ?? undefined,
      reverse: true,
    })
    .collect()
    .map((item) => ({ ...item.payload.value, feedHash: item.hash }));
});

const initialState: FeedsState = {
  hasNext: true,
  items: [],
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFeedItems.fulfilled, (state, action) => {
      if (action.payload.length < limit) {
        state.hasNext = false;
      }
      state.items = state.items.concat(action.payload);
    });
  },
});

export const selectFeed = (state: RootState): FeedItem[] => state.feed.items;

export default feedSlice.reducer;
