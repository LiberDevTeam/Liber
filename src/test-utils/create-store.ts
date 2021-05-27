import { configureStore } from '@reduxjs/toolkit';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createHashHistory } from 'history';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';
import botsReducer from '~/state/bots/botsSlice';
import feedReducer from '~/state/feed/feedSlice';
import { isInitializedSlice } from '~/state/isInitialized';
import marketplaceBotsReducer from '~/state/marketplace/botsSlice';
import marketplaceStickersReducer from '~/state/marketplace/stickersSlice';
import meReducer from '~/state/me/meSlice';
import mypageBotsReducer from '~/state/mypage/botsSlice';
import mypageStickersReducer from '~/state/mypage/stickersSlice';
import ipfsContentsReducer from '~/state/p2p/ipfsContentsSlice';
import placeMessagesReducer from '~/state/places/messagesSlice';
import placesReducer from '~/state/places/placesSlice';
import searchReducer from '~/state/search/searchSlice';
import { selectedUserSlice } from '~/state/selected-user';
import stickersReducer from '~/state/stickers/stickersSlice';
import { usersSlice } from '~/state/users/usersSlice';
import { RootState } from '../state/store';

export const history = createHashHistory();

const reducers = combineReducers({
  me: meReducer,
  mypageBots: mypageBotsReducer,
  mypageStickers: mypageStickersReducer,
  places: placesReducer,
  placeMessages: placeMessagesReducer,
  ipfsContents: ipfsContentsReducer,
  feed: feedReducer,
  users: usersSlice.reducer,
  search: searchReducer,
  bots: botsReducer,
  stickers: stickersReducer,
  router: connectRouter(history),
  marketplaceBots: marketplaceBotsReducer,
  marketplaceStickers: marketplaceStickersReducer,
  selectedUser: selectedUserSlice.reducer,
  isInitialized: isInitializedSlice.reducer,
});

export const createStore = (preloadedState: Partial<RootState>) =>
  configureStore({
    preloadedState,
    reducer: reducers,
    middleware: [thunk, routerMiddleware(history)],
  });
