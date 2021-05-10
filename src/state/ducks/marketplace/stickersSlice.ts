import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { marketplaceSearchStickers } from '~/api';
import { AppDispatch, RootState } from '~/state/store';
import { Sticker } from '../stickers/stickersSlice';

const stickersAdapter = createEntityAdapter<Sticker>();

export const searchStickers = createAsyncThunk<
  void,
  { query: string; page: number },
  { dispatch: AppDispatch; state: RootState }
>(
  'marketplace/stickers/fetchStickerItems',
  async ({ query, page }, { dispatch }) => {
    const res = await marketplaceSearchStickers(query, page);
    const { stickerIds } = await res.json();

    // TODO: fetch and store stickers information from orbitdb

    dispatch(paginate({ page, stickerIds }));
  }
);

export const stickersSlice = createSlice({
  name: 'marketplace/stickers',
  initialState: stickersAdapter.getInitialState<{
    idsByPage: Record<number, string[]>;
  }>({
    idsByPage: {},
  }),
  reducers: {
    addStickers: (state, action: PayloadAction<Sticker[]>) =>
      stickersAdapter.addMany(state, action.payload),
    paginate: (
      state,
      action: PayloadAction<{ page: number; stickerIds: string[] }>
    ) => {
      const { page, stickerIds } = action.payload;
      state.idsByPage[page] = stickerIds;
    },
  },
});

export const { paginate } = stickersSlice.actions;

const selectors = stickersAdapter.getSelectors();
export const selectIdsByPage = (page: number) => (state: RootState): string[] =>
  state.marketplaceStickers.idsByPage[page];
export const selectStickersByIds = (ids: string[]) => (
  state: RootState
): (Sticker | undefined)[] =>
  ids
    .map((id) => selectors.selectById(state.marketplaceStickers, id))
    .filter((sticker) => !!sticker);

export default stickersSlice.reducer;
