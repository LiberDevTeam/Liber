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
import meReducer from '~/state/ducks/me/meSlice';
import ipfsContentsReducer from '~/state/ducks/p2p/ipfsContentsSlice';
import placeMessagesReducer from '~/state/ducks/places/messagesSlice';
import placesReducer from '~/state/ducks/places/placesSlice';
import searchReducer from '~/state/ducks/search/searchSlice';
import usersReducer from '~/state/ducks/users/usersSlice';

export const history = createHashHistory();

enableMapSet();

const debug = true;

const mePersistConfig = {
  key: 'me',
  storage: createIdbStorage({
    name: 'liber',
    storeName: 'liber',
    version: 1,
  }),
  debug,
};

const placesPersistConfig = {
  key: 'places',
  storage: createIdbStorage({
    name: 'liber',
    storeName: 'liber',
    version: 1,
  }),
  // whitelist: ['messages', 'places'],
  debug,
};

const placeMessagesPersistConfig = {
  key: 'placeMessages',
  storage: createIdbStorage({
    name: 'liber',
    storeName: 'liber',
    version: 1,
  }),
  debug,
};

const ipfsContentsPersistConfig = {
  key: 'ipfsContents',
  storage: createIdbStorage({
    name: 'liber',
    storeName: 'liber',
    version: 1,
  }),
};

const reducers = combineReducers({
  me: persistReducer(mePersistConfig, meReducer),
  places: persistReducer(placesPersistConfig, placesReducer),
  placeMessages: persistReducer(
    placeMessagesPersistConfig,
    placeMessagesReducer
  ),
  ipfsContents: persistReducer(ipfsContentsPersistConfig, ipfsContentsReducer),
  feed: feedReducer,
  users: usersReducer,
  search: searchReducer,
  bots: botsReducer,
  router: connectRouter(history),
});

export const store = configureStore({
  reducer: reducers,
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
