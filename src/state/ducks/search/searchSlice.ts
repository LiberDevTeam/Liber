import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '~/state/store';
import { Appearance, FeedItem, ItemKind } from '../feed/feedSlice';
import { Place } from '../places/placesSlice';

interface SearchState {
  searchPostResult: FeedItem[];
  searchPlaceResult: Place[];
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

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    addSearchPostResult: (state, action: PayloadAction<FeedItem[]>) => {
      state.searchPostResult = [...state.searchPostResult, ...action.payload];
    },
  },
});

export const { addSearchPostResult } = searchSlice.actions;

export const selectSearchPostResult = (
  state: RootState
): typeof state.search.searchPostResult => state.search.searchPostResult || [];

export default searchSlice.reducer;
