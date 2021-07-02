import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { connectExplorePlaceKeyValue } from '~/lib/db/explore/place';
import { explorePlaceSearch } from '~/lib/search';
import { AppDispatch, RootState } from '~/state/store';
import { FeedItem } from '../feed/feedSlice';
import { Place } from '../places/type';

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
  const dispatch = thunkAPI.dispatch;

  const feedItems: FeedItem[] = [];
  // const feedItems: FeedItem[] = [
  //   {
  //     appearance: Appearance.DEFAULT,
  //     kind: ItemKind.MESSAGE,
  //     placeId: '22222-22222-22222-2222222222',

  //     id: '33333-33333-33333-33333333331',
  //     author: {
  //       id: '55555-55555-55555-5555555555',
  //       name: 'NaDaru',
  //       avatarCid: 'QmYxKHa7mrEo46YK86HYbSxcjPLbLwDT6aXuL5XzKA3hEJ',
  //       botsListingOn: [],
  //       stickersListingOn: [],
  //     },
  //     timestamp: 1617535796,
  //     attachmentCidList: ['QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx'],
  //     text: 'Liverpool will be back in action on Monday night when they take on Wolverhampton Wanderers at Molineux Stadium in the Premier...',
  //   },
  //   {
  //     appearance: Appearance.BIG_CARD,
  //     kind: ItemKind.MESSAGE,
  //     placeId: '22222-22222-22222-2222222222',

  //     id: '33333-33333-33333-33333333332',
  //     author: {
  //       id: '55555-55555-55555-5555555555',
  //       name: 'nadaru',
  //       avatarCid: 'QmYxKHa7mrEo46YK86HYbSxcjPLbLwDT6aXuL5XzKA3hEJ',
  //       botsListingOn: [],
  //       stickersListingOn: [],
  //     },
  //     timestamp: 1617535796,
  //     attachmentCidList: ['QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx'],
  //     text: 'Liverpool will be back in action on Monday night when they take on Wolverhampton Wanderers at Molineux Stadium in the Premier...',
  //   },
  //   {
  //     appearance: Appearance.DEFAULT,
  //     kind: ItemKind.MESSAGE,
  //     placeId: '22222-22222-22222-2222222222',

  //     id: '33333-33333-33333-33333333333',
  //     author: {
  //       id: '55555-55555-55555-5555555555',
  //       name: 'nadaru',
  //       avatarCid: 'QmYxKHa7mrEo46YK86HYbSxcjPLbLwDT6aXuL5XzKA3hEJ',
  //       botsListingOn: [],
  //       stickersListingOn: [],
  //     },
  //     timestamp: 1617535796,
  //     attachmentCidList: ['QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx'],
  //     text: 'Liverpool will be back in action on Monday night when they take on Wolverhampton Wanderers at Molineux Stadium in the Premier...',
  //   },
  //   {
  //     appearance: Appearance.BIG_CARD,
  //     kind: ItemKind.MESSAGE,
  //     placeId: '22222-22222-22222-2222222222',

  //     id: '33333-33333-33333-33333333334',
  //     author: {
  //       id: '55555-55555-55555-5555555555',
  //       name: 'nadaru',
  //       avatarCid: 'QmYxKHa7mrEo46YK86HYbSxcjPLbLwDT6aXuL5XzKA3hEJ',
  //       botsListingOn: [],
  //       stickersListingOn: [],
  //     },
  //     timestamp: 1617535796,
  //     attachmentCidList: ['QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx'],
  //     text: 'Liverpool will be back in action on Monday night when they take on Wolverhampton Wanderers at Molineux Stadium in the Premier...',
  //   },
  //   {
  //     appearance: Appearance.DEFAULT,
  //     kind: ItemKind.MESSAGE,
  //     placeId: '22222-22222-22222-2222222222',

  //     id: '33333-33333-33333-33333333335',
  //     author: {
  //       id: '55555-55555-55555-5555555555',
  //       name: 'nadaru',
  //       avatarCid: 'QmYxKHa7mrEo46YK86HYbSxcjPLbLwDT6aXuL5XzKA3hEJ',
  //       botsListingOn: [],
  //       stickersListingOn: [],
  //     },
  //     timestamp: 1617535796,
  //     attachmentCidList: ['QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx'],
  //     text: 'Liverpool will be back in action on Monday night when they take on Wolverhampton Wanderers at Molineux Stadium in the Premier...',
  //   },
  // ];

  dispatch(addSearchPostResult(feedItems));
});

export const fetchSearchPlaceResult = createAsyncThunk<
  void,
  { searchText: string },
  { dispatch: AppDispatch; state: RootState }
>('search/fetchSearchPlaceResult', async ({ searchText }, { dispatch }) => {
  let result;
  if (!searchText) {
    const db = await connectExplorePlaceKeyValue();
    result = Object.values(db.all);
  } else {
    result = explorePlaceSearch.search(searchText, { fuzzy: 0.3 });
  }

  const places: Place[] = result.map((r) => {
    const { score, terms, match, ...place } = r;
    return place as Place;
  });

  dispatch(setSearchPlaceResult(places));
});

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    addSearchPostResult: (state, action: PayloadAction<FeedItem[]>) => {
      state.searchPostResult = [...state.searchPostResult, ...action.payload];
    },
    setSearchPlaceResult: (state, action: PayloadAction<Place[]>) => {
      state.searchPlaceResult = [...action.payload];
    },
  },
});

export const { addSearchPostResult, setSearchPlaceResult } =
  searchSlice.actions;

export const selectSearchPostResult = (
  state: RootState
): typeof state.search.searchPostResult => state.search.searchPostResult || [];
export const selectSearchPlaceResult = (
  state: RootState
): typeof state.search.searchPlaceResult =>
  state.search.searchPlaceResult || [];

export default searchSlice.reducer;
