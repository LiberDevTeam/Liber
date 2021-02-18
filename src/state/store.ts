import {
  configureStore,
  ThunkAction,
  Action,
  ThunkDispatch,
} from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import placesReducer from '~/state/ducks/places/placesSlice';
import meReducer from '~/state/ducks/me/meSlice';
import placeMessagesReducer from '~/state/ducks/places/messagesSlice';
import ipfsContentsReducer from '~/state/ducks/p2p/ipfsContentsSlice';
import { persistStore, persistReducer } from 'redux-persist';
import createIdbStorage from '@piotr-cz/redux-persist-idb-storage';
import { combineReducers } from 'redux';
import { enableMapSet } from 'immer';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { useDispatch } from 'react-redux';

export const history = createBrowserHistory();

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
  router: connectRouter(history),
});

export const store = configureStore({
  reducer: reducers,
  middleware: [thunk, routerMiddleware(history), logger],
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
