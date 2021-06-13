import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '~/state/store';
import { User } from '../users/type';

export enum Appearance {
  DEFAULT,
  BIG_CARD,
}

export enum ItemKind {
  MESSAGE,
  PLACE,
}

export interface FeedItemMessage {
  appearance: Appearance;
  kind: ItemKind.MESSAGE;

  id: string;
  placeId: string;
  author: User;
  timestamp: number;
  text?: string;
  attachmentCidList: string[];
}

export interface FeedItemPlace {
  appearance: Appearance;
  kind: ItemKind.PLACE;

  id: string;
  name: string;
  description: string;
  avatarCid: string;
  timestamp: number;
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
  const state = thunkAPI.getState();
  const dispatch = thunkAPI.dispatch;

  // TODO fetching from the GraphQL endpoint.
  const feedItems: FeedItem[] = [
    {
      appearance: Appearance.DEFAULT,
      kind: ItemKind.MESSAGE,
      placeId: '22222-22222-22222-2222222222',

      id: '33333-33333-33333-33333333331',
      author: {
        id: '55555-55555-55555-5555555555',
        username: 'NaDaru',
        avatarCid: 'QmYxKHa7mrEo46YK86HYbSxcjPLbLwDT6aXuL5XzKA3hEJ',
        settings: { isIsolation: false },
      },
      timestamp: 1617535796,
      attachmentCidList: ['QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx'],
      text: 'Liverpool will be back in action on Monday night when they take on Wolverhampton Wanderers at Molineux Stadium in the Premier...',
    },
    {
      appearance: Appearance.BIG_CARD,
      kind: ItemKind.MESSAGE,
      placeId: '22222-22222-22222-2222222222',

      id: '33333-33333-33333-33333333332',
      author: {
        id: '55555-55555-55555-5555555555',
        username: 'nadaru',
        avatarCid: 'QmYxKHa7mrEo46YK86HYbSxcjPLbLwDT6aXuL5XzKA3hEJ',
        settings: { isIsolation: false },
      },
      timestamp: 1617535796,
      attachmentCidList: ['QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx'],
      text: 'Liverpool will be back in action on Monday night when they take on Wolverhampton Wanderers at Molineux Stadium in the Premier...',
    },
    {
      appearance: Appearance.DEFAULT,
      kind: ItemKind.MESSAGE,
      placeId: '22222-22222-22222-2222222222',

      id: '33333-33333-33333-33333333333',
      author: {
        id: '55555-55555-55555-5555555555',
        username: 'nadaru',
        avatarCid: 'QmYxKHa7mrEo46YK86HYbSxcjPLbLwDT6aXuL5XzKA3hEJ',
        settings: { isIsolation: false },
      },
      timestamp: 1617535796,
      attachmentCidList: ['QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx'],
      text: 'Liverpool will be back in action on Monday night when they take on Wolverhampton Wanderers at Molineux Stadium in the Premier...',
    },
    {
      appearance: Appearance.BIG_CARD,
      kind: ItemKind.MESSAGE,
      placeId: '22222-22222-22222-2222222222',

      id: '33333-33333-33333-33333333334',
      author: {
        id: '55555-55555-55555-5555555555',
        username: 'nadaru',
        avatarCid: 'QmYxKHa7mrEo46YK86HYbSxcjPLbLwDT6aXuL5XzKA3hEJ',
        settings: { isIsolation: false },
      },
      timestamp: 1617535796,
      attachmentCidList: ['QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx'],
      text: 'Liverpool will be back in action on Monday night when they take on Wolverhampton Wanderers at Molineux Stadium in the Premier...',
    },
    {
      appearance: Appearance.DEFAULT,
      kind: ItemKind.MESSAGE,
      placeId: '22222-22222-22222-2222222222',

      id: '33333-33333-33333-33333333335',
      author: {
        id: '55555-55555-55555-5555555555',
        username: 'nadaru',
        avatarCid: 'QmYxKHa7mrEo46YK86HYbSxcjPLbLwDT6aXuL5XzKA3hEJ',
        settings: { isIsolation: false },
      },
      timestamp: 1617535796,
      attachmentCidList: ['QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx'],
      text: 'Liverpool will be back in action on Monday night when they take on Wolverhampton Wanderers at Molineux Stadium in the Premier...',
    },
  ];

  dispatch(addFeedItems(feedItems));
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
