import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import placeReducer, { PlaceState } from '~/state/ducks/place/placeSlice';
import meReducer, { MeState } from '~/state/ducks/me/meSlice';
import p2pReducer from '~/state/ducks/p2p/p2pSlice';
import { persistStore, persistReducer } from 'redux-persist';
import createIdbStorage from '@piotr-cz/redux-persist-idb-storage';
import { combineReducers } from 'redux';
import { enableMapSet } from 'immer';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

export const history = createBrowserHistory();

enableMapSet();

const mePersistConfig = {
  key: 'me',
  storage: createIdbStorage({
    name: 'liber',
    storeName: 'liber',
    version: 1,
  }),
  debug: true,
};

const placePersistConfig = {
  key: 'places',
  storage: createIdbStorage({
    name: 'liber',
    storeName: 'liber',
    version: 1,
  }),
  whitelist: ['messages', 'places'],
  debug: true,
};

const reducers = combineReducers({
  me: persistReducer<MeState>(mePersistConfig, meReducer),
  place: persistReducer<PlaceState>(placePersistConfig, placeReducer),
  p2p: p2pReducer,
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
