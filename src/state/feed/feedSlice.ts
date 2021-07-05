import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
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
  items: FeedItem[];
}

export const limit = 30;

export const fetchFeedItems = createAsyncThunk<
  void,
  { hash: string } | void,
  { dispatch: AppDispatch; state: RootState }
>('feed/fetchFeedItems', async (args, { dispatch }) => {
  const db = await connectFeedDB();

  const options: { limit: number; lt?: string } = { limit };
  if (args) {
    options.lt = args.hash;
  }
  const feedItems = db
    .iterator(options)
    .collect()
    .map((item) => ({ ...item.payload.value, feedHash: item.hash }));
  if (feedItems) {
    dispatch(setFeedItems(feedItems));
  }
});

const initialState: FeedsState = {
  items: [],
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setFeedItems: (state, action: PayloadAction<FeedItem[]>) => {
      state.items = [...action.payload];
    },
  },
});

export const { setFeedItems } = feedSlice.actions;

export const selectFeed = (state: RootState) => state.feed.items;

export default feedSlice.reducer;
