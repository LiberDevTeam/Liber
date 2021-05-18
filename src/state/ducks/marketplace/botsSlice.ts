import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  marketplaceNewBots,
  marketplaceRankingBots,
  marketplaceSearchBots,
} from '~/api';
import { AppDispatch, RootState } from '~/state/store';
import { addBots, tmpListingOn } from '../bots/botsSlice';

export const fetchSearchResult = createAsyncThunk<
  void,
  { query: string; page: number },
  { dispatch: AppDispatch; state: RootState }
>(
  'marketplace/bots/fetchSearchResult',
  async ({ query, page }, { dispatch }) => {
    const res = await marketplaceSearchBots(query, page);
    const { botIds } = await res.json();

    // TODO: fetch and store bots information from orbitdb
    dispatch(addBots(tmpListingOn));

    dispatch(paginateSearchResult({ page, botIds }));
  }
);

export const fetchRanking = createAsyncThunk<
  void,
  { page: number },
  { dispatch: AppDispatch; state: RootState }
>('marketplace/bots/fetchRanking', async ({ page }, { dispatch }) => {
  const res = await marketplaceRankingBots(page);
  const { botIds } = await res.json();

  // TODO: fetch and store bots information from orbitdb
  dispatch(addBots(tmpListingOn));

  dispatch(paginateRanking({ page, botIds }));
});

export const fetchNew = createAsyncThunk<
  void,
  { page: number },
  { dispatch: AppDispatch; state: RootState }
>('marketplace/bots/fetchNew', async ({ page }, { dispatch }) => {
  const res = await marketplaceNewBots(page);
  const { botIds } = await res.json();

  // TODO: fetch and store bots information from orbitdb
  dispatch(addBots(tmpListingOn));

  dispatch(paginateNew({ page, botIds }));
});

interface State {
  searchResultIdsByPage: Record<number, string[]>;
  rankingIdsByPage: Record<number, string[]>;
  newIdsByPage: Record<number, string[]>;
}

const initialState: State = {
  searchResultIdsByPage: {},
  rankingIdsByPage: {},
  newIdsByPage: {},
};

export const botsSlice = createSlice({
  name: 'marketplace/bots',
  initialState,
  reducers: {
    paginateRanking: (
      state,
      action: PayloadAction<{ page: number; botIds: string[] }>
    ) => {
      const { page, botIds } = action.payload;
      state.rankingIdsByPage[page] = botIds;
    },
    paginateNew: (
      state,
      action: PayloadAction<{ page: number; botIds: string[] }>
    ) => {
      const { page, botIds } = action.payload;
      state.newIdsByPage[page] = botIds;
    },
    paginateSearchResult: (
      state,
      action: PayloadAction<{ page: number; botIds: string[] }>
    ) => {
      const { page, botIds } = action.payload;
      state.searchResultIdsByPage[page] = botIds;
    },
    clearSearchResult: (state) => {
      state.searchResultIdsByPage = {};
    },
  },
});

export const {
  paginateNew,
  paginateRanking,
  paginateSearchResult,
  clearSearchResult,
} = botsSlice.actions;

export default botsSlice.reducer;
