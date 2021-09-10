import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState, ThunkExtra } from '~/state/store';
import { NormalMessage, Place } from '../places/type';

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

interface FeedItemMessage extends NormalMessage, WithHash {
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

export const limit = 10;

export const fetchFeedItems = createAsyncThunk<
  FeedItem[],
  { hash: string } | void,
  { extra: ThunkExtra }
>('feed/fetchFeedItems', async (args, { extra }) => {
  const db = await extra.db.feed.connect();

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
