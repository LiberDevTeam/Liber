import {
  Action,
  configureStore,
  getDefaultMiddleware,
  ThunkAction,
} from '@reduxjs/toolkit';
import { combineReducers, StoreEnhancer } from 'redux';
import devToolsEnhancer from 'remote-redux-devtools';
import botsReducer from '~/state/bots/botsSlice';
import feedReducer from '~/state/feed/feedSlice';
import marketplaceBotsReducer from '~/state/marketplace/botsSlice';
import marketplaceStickersReducer from '~/state/marketplace/stickersSlice';
import meReducer from '~/state/me/meSlice';
import ipfsContentsReducer from '~/state/p2p/ipfsContentsSlice';
import placeMessagesReducer from '~/state/places/messagesSlice';
import placesReducer from '~/state/places/placesSlice';
import searchReducer from '~/state/search/searchSlice';
import { selectedUserSlice } from '~/state/selected-user';
import stickersReducer from '~/state/stickers/stickersSlice';
import { usersSlice } from '~/state/users/usersSlice';
import { isInitializedSlice } from './isInitialized';

export const reducers = combineReducers({
  me: meReducer,
  places: placesReducer,
  placeMessages: placeMessagesReducer,
  ipfsContents: ipfsContentsReducer,
  feed: feedReducer,
  users: usersSlice.reducer,
  search: searchReducer,
  bots: botsReducer,
  stickers: stickersReducer,
  marketplaceBots: marketplaceBotsReducer,
  marketplaceStickers: marketplaceStickersReducer,
  selectedUser: selectedUserSlice.reducer,
  isInitialized: isInitializedSlice.reducer,
});

const enhancers: StoreEnhancer[] = [];

// @ts-ignore
if (!window.devToolsExtension) {
  enhancers.push(devToolsEnhancer({ realtime: true, port: 8000 }));
}

export const store = configureStore({
  reducer: reducers,
  middleware: [...getDefaultMiddleware({})] as const,
  enhancers,
});

export type RootState = ReturnType<typeof reducers>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export type AppDispatch = typeof store.dispatch;
