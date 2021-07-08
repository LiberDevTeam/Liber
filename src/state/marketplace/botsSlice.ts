import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { connectMarketplaceBotNewKeyValue } from '~/lib/db/marketplace/bot/new';
import { connectMarketplaceBotRankingKeyValue } from '~/lib/db/marketplace/bot/ranking';
import { marketplaceBotSearch } from '~/lib/search';
import { AppDispatch, RootState } from '~/state/store';
import { addBots } from '../bots/botsSlice';
import { Bot } from '../bots/types';

export const fetchSearchResult = createAsyncThunk<
  void,
  { query: string; page: number },
  { dispatch: AppDispatch; state: RootState }
>(
  'marketplace/bots/fetchSearchResult',
  async ({ query, page }, { dispatch }) => {
    const limit = 10;
    const result = marketplaceBotSearch
      .search(query, { fuzzy: 0.3 })
      .slice((page - 1) * limit, page * limit);

    const bots: Bot[] = result.map((r) => {
      const { score, terms, match, ...bot } = r;
      return bot as Bot;
    });

    dispatch(addBots(bots));

    dispatch(paginateSearchResult({ page, bots }));
  }
);

export const fetchRanking = createAsyncThunk<
  void,
  { page: number },
  { dispatch: AppDispatch; state: RootState }
>('marketplace/bots/fetchRanking', async ({ page }, { dispatch }) => {
  // TODO change to connect the ranking db
  const db = await connectMarketplaceBotRankingKeyValue();
  const bots = Object.values(db.all)
    .filter((a: any): a is Bot => !!a)
    .sort((a, b) => (a.qtySold > b.qtySold ? -1 : 1));

  dispatch(addBots(bots));

  dispatch(paginateRanking({ page, bots }));
});

export const fetchNew = createAsyncThunk<
  void,
  { page: number },
  { dispatch: AppDispatch; state: RootState }
>('marketplace/bots/fetchNew', async ({ page }, { dispatch }) => {
  const db = await connectMarketplaceBotNewKeyValue();
  const bots = Object.values(db.all).reverse();

  dispatch(addBots(bots));

  dispatch(paginateNew({ page, bots }));
});

interface State {
  searchResultBotsByPage: Record<number, Bot[]>;
  rankingBotsByPage: Record<number, Bot[]>;
  newBotsByPage: Record<number, Bot[]>;
}

const initialState: State = {
  searchResultBotsByPage: {},
  rankingBotsByPage: {},
  newBotsByPage: {},
};

export const botsSlice = createSlice({
  name: 'marketplace/bots',
  initialState,
  reducers: {
    paginateRanking: (
      state,
      action: PayloadAction<{ page: number; bots: Bot[] }>
    ) => {
      const { page, bots } = action.payload;
      state.rankingBotsByPage[page] = bots;
    },
    paginateNew: (
      state,
      action: PayloadAction<{ page: number; bots: Bot[] }>
    ) => {
      const { page, bots } = action.payload;
      state.newBotsByPage[page] = bots;
    },
    paginateSearchResult: (
      state,
      action: PayloadAction<{ page: number; bots: Bot[] }>
    ) => {
      const { page, bots } = action.payload;
      state.searchResultBotsByPage[page] = bots;
    },
    clearSearchResult: (state) => {
      state.searchResultBotsByPage = {};
    },
  },
});

export const {
  paginateNew,
  paginateRanking,
  paginateSearchResult,
  clearSearchResult,
} = botsSlice.actions;

export const selectSearchResultBotsByPage =
  (page: number) =>
  (state: RootState): Bot[] =>
    state.marketplaceBots.searchResultBotsByPage[page] || [];
export const selectNewBotsByPage =
  (page: number) =>
  (state: RootState): Bot[] =>
    state.marketplaceBots.newBotsByPage[page] || [];
export const selectRankingBotsByPage =
  (page: number) =>
  (state: RootState): Bot[] =>
    state.marketplaceBots.rankingBotsByPage[page] || [];

export default botsSlice.reducer;
