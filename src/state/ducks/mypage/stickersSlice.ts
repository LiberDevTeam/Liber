import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '~/state/store';
import { Sticker, tmpListingOn, tmpPurchased } from '../stickers/stickersSlice';

interface State {
  purchased: Sticker[];
  listingOn: Sticker[];
}

const initialState: State = {
  purchased: tmpPurchased,
  listingOn: tmpListingOn,
};

export const stickersSlice = createSlice({
  name: 'mypage/stickers',
  initialState,
  reducers: {
    listStickerOnMarketplace: (state, action: PayloadAction<Sticker>) => {
      state.listingOn = [...state.listingOn, action.payload];
    },
    purchasedSticker: (state, action: PayloadAction<Sticker>) => {
      state.purchased = [...state.purchased, action.payload];
    },
  },
});

export const {
  listStickerOnMarketplace,
  purchasedSticker,
} = stickersSlice.actions;

export const selectPurchasedStickers = (
  state: RootState
): typeof state.mypageStickers.purchased => state.mypageStickers.purchased;

export const selectStickersListingOn = (
  state: RootState
): typeof state.mypageStickers.listingOn => state.mypageStickers.listingOn;

export const selectPurchasedStickerById = (id: string) => (state: RootState) =>
  state.mypageStickers.purchased.find((elm) => elm.id === id);

export default stickersSlice.reducer;
