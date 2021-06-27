import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { connectStickerKeyValue, readStickerFromDB } from '~/lib/db/sticker';
import { AppDispatch, RootState } from '~/state/store';
import { addStickers, tmpListingOn } from '../stickers/stickersSlice';

export const fetchSearchResult = createAsyncThunk<
  void,
  { query: string; page: number },
  { dispatch: AppDispatch; state: RootState }
>(
  'marketplace/stickers/fetchSearchResult',
  async ({ query, page }, { dispatch }) => {
    // const res = await marketplaceSearchStickers(query, page);
    // const { determiners } = await res.json();
    const determiners = tmpListingOn;

    // TODO: fetch and store stickers information from orbitdb
    const stickers = await Promise.all(
      determiners.map(async (sticker) => {
        return readStickerFromDB(
          await connectStickerKeyValue({
            stickerId: sticker.id,
            address: sticker.keyValAddress,
          })
        );
      })
    );
    dispatch(addStickers(stickers));

    const stickerIds = stickers.map((s) => s.id);
    dispatch(paginateSearchResult({ page, stickerIds }));
  }
);

export const fetchRanking = createAsyncThunk<
  void,
  { page: number },
  { dispatch: AppDispatch; state: RootState }
>('marketplace/stickers/fetchRanking', async ({ page }, { dispatch }) => {
  // const res = await marketplaceRankingStickers(page);
  // const { stickerIds } = await res.json();

  // TODO: fetch and store stickers information from orbitdb
  dispatch(addStickers(tmpListingOn));

  dispatch(
    paginateRanking({ page, stickerIds: tmpListingOn.map((s) => s.id) })
  );
});

export const fetchNew = createAsyncThunk<
  void,
  { page: number },
  { dispatch: AppDispatch; state: RootState }
>('marketplace/stickers/fetchNew', async ({ page }, { dispatch }) => {
  // const res = await marketplaceNewStickers(page);
  // const { stickerIds } = await res.json();

  // TODO: fetch and store stickers information from orbitdb
  dispatch(addStickers(tmpListingOn));

  dispatch(paginateNew({ page, stickerIds: tmpListingOn.map((s) => s.id) }));
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

export const stickersSlice = createSlice({
  name: 'marketplace/stickers',
  initialState,
  reducers: {
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
  paginateNew,
  paginateRanking,
  paginateSearchResult,
  clearSearchResult,
} = stickersSlice.actions;

export const selectSearchResultIdsByPage =
  (page: number) =>
  (state: RootState): string[] =>
    state.marketplaceStickers.searchResultIdsByPage[page] || [];
export const selectNewIdsByPage =
  (page: number) =>
  (state: RootState): string[] =>
    state.marketplaceStickers.newIdsByPage[page] || [];
export const selectRankingIdsByPage =
  (page: number) =>
  (state: RootState): string[] =>
    state.marketplaceStickers.rankingIdsByPage[page] || [];

export default stickersSlice.reducer;
