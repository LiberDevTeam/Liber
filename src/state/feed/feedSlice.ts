import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
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

interface FeedItemMessage extends Message {
  itemType: ItemType.MESSAGE;
}

interface FeedItemPlace extends Place {
  itemType: ItemType.PLACE;
}

export type FeedItem = FeedItemMessage | FeedItemPlace;

export interface FeedsState {
  items: FeedItem[];
}

export const fetchFeedItems = createAsyncThunk<
  void,
  { lastTimestamp: number } | void,
  { dispatch: AppDispatch; state: RootState }
>('feed/fetchFeedItems', async (_, thunkAPI) => {
  const dispatch = thunkAPI.dispatch;
  dispatch(addFeedItems([]));
});

const initialState: FeedsState = {
  items: [],
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    addFeedItems: (state, action: PayloadAction<FeedItem[]>) => {
      state.items = [...state.items, ...action.payload];
    },
  },
});

export const { addFeedItems } = feedSlice.actions;

export const selectFeed = (state: RootState): typeof state.feed => state.feed;

export default feedSlice.reducer;
