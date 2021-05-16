import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  marketplaceNewStickers,
  marketplaceRankingStickers,
  marketplaceSearchStickers,
} from '~/api';
import { AppDispatch, RootState } from '~/state/store';
import { Sticker, tmpListingOn } from '../stickers/stickersSlice';

const stickersAdapter = createEntityAdapter<Sticker>();

export const fetchSearchResult = createAsyncThunk<
  void,
  { query: string; page: number },
  { dispatch: AppDispatch; state: RootState }
>(
  'marketplace/stickers/fetchSearchResult',
  async ({ query, page }, { dispatch }) => {
    const res = await marketplaceSearchStickers(query, page);
    const { stickerIds } = await res.json();

    // TODO: fetch and store stickers information from orbitdb
    dispatch(addStickers(tmpListingOn));

    dispatch(paginateSearchResult({ page, stickerIds }));
  }
);

export const fetchRanking = createAsyncThunk<
  void,
  { page: number },
  { dispatch: AppDispatch; state: RootState }
>('marketplace/stickers/fetchRanking', async ({ page }, { dispatch }) => {
  const res = await marketplaceRankingStickers(page);
  const { stickerIds } = await res.json();

  // TODO: fetch and store stickers information from orbitdb
  dispatch(addStickers(tmpListingOn));

  dispatch(paginateRanking({ page, stickerIds }));
});

export const fetchNew = createAsyncThunk<
  void,
  { page: number },
  { dispatch: AppDispatch; state: RootState }
>('marketplace/stickers/fetchNew', async ({ page }, { dispatch }) => {
  const res = await marketplaceNewStickers(page);
  const { stickerIds } = await res.json();

  // TODO: fetch and store stickers information from orbitdb
  dispatch(addStickers(tmpListingOn));

  dispatch(paginateNew({ page, stickerIds }));
});

export const stickersSlice = createSlice({
  name: 'marketplace/stickers',
  initialState: stickersAdapter.getInitialState<{
    searchResultIdsByPage: Record<number, string[]>;
    rankingIdsByPage: Record<number, string[]>;
    newIdsByPage: Record<number, string[]>;
  }>({
    searchResultIdsByPage: {},
    rankingIdsByPage: {},
    newIdsByPage: {},
  }),
  reducers: {
    addStickers: (state, action: PayloadAction<Sticker[]>) =>
      stickersAdapter.addMany(state, action.payload),
    paginateRanking: (
      state,
      action: PayloadAction<{ page: number; stickerIds: string[] }>
    ) => {
      const { page, stickerIds } = action.payload;
      state.rankingIdsByPage[page] = stickerIds;
    },
    paginateNew: (
      state,
      action: PayloadAction<{ page: number; stickerIds: string[] }>
    ) => {
      const { page, stickerIds } = action.payload;
      state.newIdsByPage[page] = stickerIds;
    },
    paginateSearchResult: (
      state,
      action: PayloadAction<{ page: number; stickerIds: string[] }>
    ) => {
      const { page, stickerIds } = action.payload;
      state.searchResultIdsByPage[page] = stickerIds;
    },
    clearSearchResult: (state) => {
      state.searchResultIdsByPage = {};
    },
  },
});

export const {
  addStickers,
  paginateNew,
  paginateRanking,
  paginateSearchResult,
  clearSearchResult,
} = stickersSlice.actions;

const selectors = stickersAdapter.getSelectors();
export const selectSearchResultIdsByPage = (page: number) => (
  state: RootState
): string[] => state.marketplaceStickers.searchResultIdsByPage[page] || [];
export const selectNewIdsByPage = (page: number) => (
  state: RootState
): string[] => state.marketplaceStickers.newIdsByPage[page] || [];
export const selectRankingIdsByPage = (page: number) => (
  state: RootState
): string[] => state.marketplaceStickers.rankingIdsByPage[page] || [];
export const selectStickersByIds = (ids: string[]) => (
  state: RootState
): (Sticker | undefined)[] =>
  ids.map((id) => selectors.selectById(state.marketplaceStickers, id));

export default stickersSlice.reducer;
