import { configureStore } from '@reduxjs/toolkit';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createHashHistory } from 'history';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';
import botsReducer from '~/state/ducks/bots/botsSlice';
import feedReducer from '~/state/ducks/feed/feedSlice';
import { isInitializedSlice } from '~/state/ducks/isInitialized';
import marketplaceBotsReducer from '~/state/ducks/marketplace/botsSlice';
import marketplaceStickersReducer from '~/state/ducks/marketplace/stickersSlice';
import meReducer from '~/state/ducks/me/meSlice';
import mypageBotsReducer from '~/state/ducks/mypage/botsSlice';
import mypageStickersReducer from '~/state/ducks/mypage/stickersSlice';
import ipfsContentsReducer from '~/state/ducks/p2p/ipfsContentsSlice';
import placeMessagesReducer from '~/state/ducks/places/messagesSlice';
import placesReducer from '~/state/ducks/places/placesSlice';
import searchReducer from '~/state/ducks/search/searchSlice';
import { selectedUserSlice } from '~/state/ducks/selected-user';
import stickersReducer from '~/state/ducks/stickers/stickersSlice';
import { usersSlice } from '~/state/ducks/users/usersSlice';
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
