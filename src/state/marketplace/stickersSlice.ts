import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { connectMarketplaceStickerNewKeyValue } from '~/lib/db/marketplace/sticker/new';
import { connectMarketplaceStickerRankingKeyValue } from '~/lib/db/marketplace/sticker/ranking';
import { marketplaceStickerSearch } from '~/lib/search';
import { addStickers } from '~/state/stickers/stickersSlice';
import { Sticker } from '~/state/stickers/types';
import { AppDispatch, RootState } from '~/state/store';

export const fetchSearchResult = createAsyncThunk<
  void,
  { query: string; page: number },
  { dispatch: AppDispatch; state: RootState }
>(
  'marketplace/stickers/fetchSearchResult',
  async ({ query, page }, { dispatch }) => {
    const limit = 10;
    const result = marketplaceStickerSearch
      .search(query, { fuzzy: 0.3 })
      .slice((page - 1) * limit, page * limit);

    const stickers: Sticker[] = result.map((r) => {
      const { score, terms, match, ...sticker } = r;
      return sticker as Sticker;
    });

    dispatch(addStickers(stickers));

    dispatch(paginateSearchResult({ page, stickers }));
  }
);

export const fetchRanking = createAsyncThunk<
  void,
  { page: number },
  { dispatch: AppDispatch; state: RootState }
>('marketplace/stickers/fetchRanking', async ({ page }, { dispatch }) => {
  const db = await connectMarketplaceStickerRankingKeyValue();
  const stickers = Object.values(db.all)
    .filter((a: any): a is Sticker => !!a)
    .sort((a, b) => (a.qtySold > b.qtySold ? -1 : 1));

  dispatch(addStickers(stickers));

  dispatch(paginateRanking({ page, stickers }));
});

export const fetchNew = createAsyncThunk<
  void,
  { page: number },
  { dispatch: AppDispatch; state: RootState }
>('marketplace/stickers/fetchNew', async ({ page }, { dispatch }) => {
  const db = await connectMarketplaceStickerNewKeyValue();
  const stickers = Object.values(db.all).reverse();

  dispatch(addStickers(stickers));

  dispatch(paginateNew({ page, stickers }));
});

interface State {
  searchResultStickersByPage: Record<number, Sticker[]>;
  rankingStickersByPage: Record<number, Sticker[]>;
  newStickersByPage: Record<number, Sticker[]>;
}

const initialState: State = {
  searchResultStickersByPage: {},
  rankingStickersByPage: {},
  newStickersByPage: {},
};

export const stickersSlice = createSlice({
  name: 'marketplace/stickers',
  initialState,
  reducers: {
    paginateRanking: (
      state,
      action: PayloadAction<{ page: number; stickers: Sticker[] }>
    ) => {
      const { page, stickers } = action.payload;
      state.rankingStickersByPage[page] = stickers;
    },
    paginateNew: (
      state,
      action: PayloadAction<{ page: number; stickers: Sticker[] }>
    ) => {
      const { page, stickers } = action.payload;
      state.newStickersByPage[page] = stickers;
    },
    paginateSearchResult: (
      state,
      action: PayloadAction<{ page: number; stickers: Sticker[] }>
    ) => {
      const { page, stickers } = action.payload;
      state.searchResultStickersByPage[page] = stickers;
    },
    clearSearchResult: (state) => {
      state.searchResultStickersByPage = {};
    },
  },
});

export const {
  paginateNew,
  paginateRanking,
  paginateSearchResult,
  clearSearchResult,
} = stickersSlice.actions;

export const selectSearchResultIdsByPage =
  (page: number) =>
  (state: RootState): Sticker[] =>
    state.marketplaceStickers.searchResultStickersByPage[page] || [];
export const selectNewStickersByPage =
  (page: number) =>
  (state: RootState): Sticker[] =>
    state.marketplaceStickers.newStickersByPage[page] || [];
export const selectRankingStickersByPage =
  (page: number) =>
  (state: RootState): Sticker[] =>
    state.marketplaceStickers.rankingStickersByPage[page] || [];

export default stickersSlice.reducer;
