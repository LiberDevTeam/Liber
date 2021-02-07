import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import channelReducer, {
  ChannelState,
} from '~/state/ducks/channel/channelSlice';
import meReducer, { MeState } from '~/state/ducks/me/meSlice';
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

const channelPersistConfig = {
  key: 'channel',
  storage: createIdbStorage({
    name: 'liber',
    storeName: 'liber',
    version: 1,
  }),
  whitelist: ['messages'],
  debug: true,
};

const reducers = combineReducers({
  me: persistReducer<MeState>(mePersistConfig, meReducer),
  channel: persistReducer<ChannelState>(channelPersistConfig, channelReducer),
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
