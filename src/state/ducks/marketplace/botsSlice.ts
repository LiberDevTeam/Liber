import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { searchMarketplaceBots } from '~/api';
import { AppDispatch, RootState } from '~/state/store';
import { Bot } from '../bots/botsSlice';

const botsAdapter = createEntityAdapter<Bot>();

export const fetchSearchBotResult = createAsyncThunk<
  void,
  { query: string; page: number },
  { dispatch: AppDispatch; state: RootState }
>('marketplace/bots/fetchBotItems', async ({ query, page }, { dispatch }) => {
  const res = await searchMarketplaceBots(query, page);
  const { botIds } = await res.json();

  // TODO: fetch and store bots information from orbitdb

  dispatch(paginate({ page, botIds }));
});

export const botsSlice = createSlice({
  name: 'marketplace/bots',
  initialState: botsAdapter.getInitialState<{
    idsByPage: Record<number, string[]>;
  }>({
    idsByPage: {},
  }),
  reducers: {
    addUser: (state, action: PayloadAction<Bot[]>) =>
      botsAdapter.addMany(state, action.payload),
    paginate: (
      state,
      action: PayloadAction<{ page: number; botIds: string[] }>
    ) => {
      const { page, botIds } = action.payload;
      state.idsByPage[page] = botIds;
    },
  },
});

export const { paginate } = botsSlice.actions;

export default botsSlice.reducer;
