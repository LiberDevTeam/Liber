import createIdbStorage from '@piotr-cz/redux-persist-idb-storage';
import {
  Action,
  configureStore,
  ThunkAction,
  ThunkDispatch,
} from '@reduxjs/toolkit';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createHashHistory } from 'history';
import { enableMapSet } from 'immer';
import { useDispatch } from 'react-redux';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import botsReducer from '~/state/ducks/bots/botsSlice';
import feedReducer from '~/state/ducks/feed/feedSlice';
import marketplaceBotsReducer from '~/state/ducks/marketplace/botsSlice';
import marketplaceStickersReducer from '~/state/ducks/marketplace/stickersSlice';
import meReducer from '~/state/ducks/me/meSlice';
import mypageBotsReducer from '~/state/ducks/mypage/botsSlice';
import ipfsContentsReducer from '~/state/ducks/p2p/ipfsContentsSlice';
import placeMessagesReducer from '~/state/ducks/places/messagesSlice';
import placesReducer from '~/state/ducks/places/placesSlice';
import searchReducer from '~/state/ducks/search/searchSlice';
import { selectedUserSlice } from '~/state/ducks/selected-user';
import stickersReducer from '~/state/ducks/stickers/stickersSlice';
import { usersSlice } from '~/state/ducks/users/usersSlice';

export const history = createHashHistory();

enableMapSet();

const debug = true;

const persistConfig = {
  key: 'root',
  storage: createIdbStorage({
    name: 'liber',
    storeName: 'liber',
    version: 1,
  }),
  whitelist: ['me', 'places', 'placeMessages', 'ipfsContents'],
  debug,
};

const reducers = combineReducers({
  me: meReducer,
  mypageBots: mypageBotsReducer,
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
});

export const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: [thunk, routerMiddleware(history)],
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof reducers>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export type AppDispatch = typeof store.dispatch;
export type AppThunkDispatch = ThunkDispatch<RootState, any, Action>;
export function useReduxDispatch(): AppThunkDispatch {
  return useDispatch<AppThunkDispatch>();
}
