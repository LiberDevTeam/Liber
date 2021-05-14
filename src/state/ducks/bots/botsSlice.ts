import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '~/state/store';

export interface TestCase {
  name: string;
  input: string;
  output: string;
}

export interface Bot {
  id: string;
  uid: string;
  name: string;
  category: string;
  description: string;
  avatar: string;
  price: number;
  document: string;
  code: string;
  testCases: TestCase[];
  created: number;
  purchased?: number;
}

export interface FeedsState {
  purchased: Bot[];
  listingOn: Bot[];
}

const tmpPurchased: Bot[] = [...Array(10)].map((_, i) => ({
  id: `9C095752-A668-4BCB-A61C-7083585BDCD${i}`,
  uid: `94801C77-68E9-4193-B253-C91983477A0${i}`,
  name: 'レムタソ',
  description: '出勤簿管理',
  document: '使い方',
  avatar: 'QmYxKHa7mrEo46YK86HYbSxcjPLbLwDT6aXuL5XzKA3hEJ',
  price: 20,
  code: `return 'helllo'`,
  created: 1619251130,
  category: '',
  testCases: [],
}));

const tmpListingOn: Bot[] = [...Array(10)].map((_, i) => ({
  id: `9C095752-A668-4BCB-A61C-7083585BDCD${i}`,
  uid: `94801C77-68E9-4193-B253-C91983477A0${i}`,
  name: 'レムタソ',
  description: '出勤簿管理',
  document: '使い方',
  avatar: 'QmYxKHa7mrEo46YK86HYbSxcjPLbLwDT6aXuL5XzKA3hEJ',
  price: 20,
  code: `return 'helllo'`,
  created: 1619251130,
  category: '',
  testCases: [],
}));

const initialState: FeedsState = {
  purchased: tmpPurchased,
  listingOn: tmpListingOn,
};

export const botsSlice = createSlice({
  name: 'bots',
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
): typeof state.bots.purchased => state.bots.purchased;

export const selectBotsListingOn = (
  state: RootState
): typeof state.bots.listingOn => state.bots.listingOn;

export default botsSlice.reducer;
