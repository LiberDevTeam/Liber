import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '~/state/store';
import { Appearance, FeedItem, ItemKind } from '../feed/feedSlice';
import { PlaceInfo } from '../places/placesSlice';

interface SearchState {
  searchPostResult: FeedItem[];
  searchPlaceResult: PlaceInfo[];
}

const initialState: SearchState = {
  searchPostResult: [],
  searchPlaceResult: [],
};

export const fetchSearchPostResult = createAsyncThunk<
  void,
  { searchText: string; lastTimestamp?: number } | void,
  { dispatch: AppDispatch; state: RootState }
>('search/fetchSearchPostResult', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const dispatch = thunkAPI.dispatch;

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
      },
      timestamp: 1617535796,
      attachmentCidList: ['QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx'],
      text:
        'Liverpool will be back in action on Monday night when they take on Wolverhampton Wanderers at Molineux Stadium in the Premier...',
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
      },
      timestamp: 1617535796,
      attachmentCidList: ['QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx'],
      text:
        'Liverpool will be back in action on Monday night when they take on Wolverhampton Wanderers at Molineux Stadium in the Premier...',
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
      },
      timestamp: 1617535796,
      attachmentCidList: ['QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx'],
      text:
        'Liverpool will be back in action on Monday night when they take on Wolverhampton Wanderers at Molineux Stadium in the Premier...',
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
      },
      timestamp: 1617535796,
      attachmentCidList: ['QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx'],
      text:
        'Liverpool will be back in action on Monday night when they take on Wolverhampton Wanderers at Molineux Stadium in the Premier...',
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
      },
      timestamp: 1617535796,
      attachmentCidList: ['QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx'],
      text:
        'Liverpool will be back in action on Monday night when they take on Wolverhampton Wanderers at Molineux Stadium in the Premier...',
    },
  ];

  dispatch(addSearchPostResult(feedItems));
});

export const fetchSearchPlaceResult = createAsyncThunk<
  void,
  { searchText: string; offset?: number } | void,
  { dispatch: AppDispatch; state: RootState }
>('search/fetchSearchPlaceResult', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const dispatch = thunkAPI.dispatch;

  const feedItems: PlaceInfo[] = [
    {
      id: '11111-11111-11111-11111-1111111111',
      name: 'place1',
      description: 'place1 description',
      avatarCid: 'QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx',
      passwordRequired: false,
      createdAt: 1618239304,
      category: 1,
    },
    {
      id: '22222-22222-22222-22222-2222222222',
      name: 'place2',
      description: 'place1 description',
      avatarCid: 'QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx',
      passwordRequired: false,
      createdAt: 1618239304,
      category: 2,
    },
    {
      id: '33333-33333-33333-33333-3333333333',
      name: 'place3',
      description: 'place1 description',
      avatarCid: 'QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx',
      passwordRequired: false,
      createdAt: 1618339304,
      category: 3,
    },
    {
      id: '44444-44444-44444-44444-4444444444',
      name: 'place4',
      description: 'place1 description',
      avatarCid: 'QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx',
      passwordRequired: false,
      createdAt: 1618449404,
      category: 4,
    },
    {
      id: '11111-11111-11111-11111-1111111111',
      name: 'place1',
      description: 'place1 description',
      avatarCid: 'QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx',
      passwordRequired: false,
      createdAt: 1618239304,
      category: 1,
    },
    {
      id: '22222-22222-22222-22222-2222222222',
      name: 'place2',
      description: 'place1 description',
      avatarCid: 'QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx',
      passwordRequired: false,
      createdAt: 1618239304,
      category: 2,
    },
    {
      id: '33333-33333-33333-33333-3333333333',
      name: 'place3',
      description: 'place1 description',
      avatarCid: 'QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx',
      passwordRequired: false,
      createdAt: 1618339304,
      category: 3,
    },
    {
      id: '44444-44444-44444-44444-4444444444',
      name: 'place4',
      description: 'place1 description',
      avatarCid: 'QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx',
      passwordRequired: false,
      createdAt: 1618449404,
      category: 4,
    },
  ];

  dispatch(addSearchPlaceResult(feedItems));
});

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    addSearchPostResult: (state, action: PayloadAction<FeedItem[]>) => {
      state.searchPostResult = [...state.searchPostResult, ...action.payload];
    },
    addSearchPlaceResult: (state, action: PayloadAction<PlaceInfo[]>) => {
      state.searchPlaceResult = [...state.searchPlaceResult, ...action.payload];
    },
  },
});

export const {
  addSearchPostResult,
  addSearchPlaceResult,
} = searchSlice.actions;

export const selectSearchPostResult = (
  state: RootState
): typeof state.search.searchPostResult => state.search.searchPostResult || [];
export const selectSearchPlaceResult = (
  state: RootState
): typeof state.search.searchPlaceResult =>
  state.search.searchPlaceResult || [];

export default searchSlice.reducer;