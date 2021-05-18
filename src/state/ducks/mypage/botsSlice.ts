import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '~/state/store';
import { Bot, tmpListingOn, tmpPurchased } from '../bots/botsSlice';

interface State {
  purchased: Bot[];
  listingOn: Bot[];
}

const initialState: State = {
  purchased: tmpPurchased,
  listingOn: tmpListingOn,
};

export const botsSlice = createSlice({
  name: 'mypage/bots',
  initialState,
  reducers: {
    listBotOnMarketplace: (state, action: PayloadAction<Bot>) => {
      state.listingOn = [...state.listingOn, action.payload];
    },
    purchasedBot: (state, action: PayloadAction<Bot>) => {
      state.purchased = [...state.purchased, action.payload];
    },
  },
});

export const { listBotOnMarketplace, purchasedBot } = botsSlice.actions;

export const selectPurchasedBots = (
  state: RootState
): typeof state.mypageBots.purchased => state.mypageBots.purchased;

export const selectBotsListingOn = (
  state: RootState
): typeof state.mypageBots.listingOn => state.mypageBots.listingOn;

export const selectPurchasedBotById = (id: string) => (state: RootState) =>
  state.mypageBots.purchased.find((elm) => elm.id === id);

export default botsSlice.reducer;
