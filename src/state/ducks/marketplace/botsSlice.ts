import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  marketplaceNewBots,
  marketplaceRankingBots,
  marketplaceSearchBots,
} from '~/api';
import { AppDispatch, RootState } from '~/state/store';
import { Bot } from '../bots/botsSlice';

const botsAdapter = createEntityAdapter<Bot>();

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

  dispatch(paginateSearchResult({ page, botIds }));
});

export const fetchNew = createAsyncThunk<
  void,
  { page: number },
  { dispatch: AppDispatch; state: RootState }
>('marketplace/bots/fetchNew', async ({ page }, { dispatch }) => {
  const res = await marketplaceNewBots(page);
  const { botIds } = await res.json();

  // TODO: fetch and store bots information from orbitdb

  dispatch(paginateSearchResult({ page, botIds }));
});

export const botsSlice = createSlice({
  name: 'marketplace/bots',
  initialState: botsAdapter.getInitialState<{
    searchResultIdsByPage: Record<number, string[]>;
    rankingIdsByPage: Record<number, string[]>;
    newIdsByPage: Record<number, string[]>;
  }>({
    searchResultIdsByPage: {},
    rankingIdsByPage: {},
    newIdsByPage: {},
  }),
  reducers: {
    addBots: (state, action: PayloadAction<Bot[]>) =>
      botsAdapter.addMany(state, action.payload),
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
  },
});

export const { paginateSearchResult } = botsSlice.actions;

const selectors = botsAdapter.getSelectors();
export const selectSearchResultIdsByPage = (page: number) => (
  state: RootState
): string[] => state.marketplaceBots.searchResultIdsByPage[page] || [];
export const selectNewIdsByPage = (page: number) => (
  state: RootState
): string[] => state.marketplaceBots.newIdsByPage[page] || [];
export const selectRankingIdsByPage = (page: number) => (
  state: RootState
): string[] => state.marketplaceBots.rankingIdsByPage[page] || [];
export const selectBotsByIds = (ids: string[]) => (
  state: RootState
): (Bot | undefined)[] =>
  ids.map((id) => selectors.selectById(state.marketplaceBots, id));

export default botsSlice.reducer;
