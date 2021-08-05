import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { exploreMessageSearch, explorePlaceSearch } from '~/lib/search';
import { AppDispatch, RootState, ThunkExtra } from '~/state/store';
import { Message, Place } from '../places/type';

interface SearchState {
  searchMessageResult: Message[];
  searchPlaceResult: Place[];
}

const initialState: SearchState = {
  searchMessageResult: [],
  searchPlaceResult: [],
};

export const fetchSearchMessageResult = createAsyncThunk<
  void,
  { searchText: string },
  { dispatch: AppDispatch; state: RootState; extra: ThunkExtra }
>(
  'search/fetchSearchMessageResult',
  async ({ searchText }, { dispatch, extra }) => {
    let result;
    if (!searchText) {
      const db = await extra.db.exploreMessage.connect();
      result = Object.values(db.all);
    } else {
      result = exploreMessageSearch.search(searchText, { fuzzy: 0.3 });
    }

    const messages: Message[] = result.map((r) => {
      const { score, terms, match, ...message } = r;
      return message as Message;
    });

    dispatch(setSearchMessageResult(messages));
  }
);

export const fetchSearchPlaceResult = createAsyncThunk<
  void,
  { searchText: string },
  { dispatch: AppDispatch; state: RootState; extra: ThunkExtra }
>(
  'search/fetchSearchPlaceResult',
  async ({ searchText }, { dispatch, extra }) => {
    let result;
    if (!searchText) {
      const db = await extra.db.explorePlace.connect();
      result = Object.values(db.all);
    } else {
      result = explorePlaceSearch.search(searchText, { fuzzy: 0.3 });
    }

    const places: Place[] = result.map((r) => {
      const { score, terms, match, ...place } = r;
      return place as Place;
    });

    dispatch(setSearchPlaceResult(places));
  }
);

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchMessageResult: (state, action: PayloadAction<Message[]>) => {
      state.searchMessageResult = [...action.payload];
    },
    setSearchPlaceResult: (state, action: PayloadAction<Place[]>) => {
      state.searchPlaceResult = [...action.payload];
    },
  },
});

export const { setSearchMessageResult, setSearchPlaceResult } =
  searchSlice.actions;

export const selectSearchMessageResult = (
  state: RootState
): typeof state.search.searchMessageResult =>
  state.search.searchMessageResult || [];
export const selectSearchPlaceResult = (
  state: RootState
): typeof state.search.searchPlaceResult =>
  state.search.searchPlaceResult || [];

export default searchSlice.reducer;
