import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import channelReducer, { ChannelState } from '../features/channel/channelSlice';
import meReducer, { MeState } from '../features/me/meSlice';
import applicationReducer from '../features/application/applicationSlice';
// import systemReducer from '../features/system/systemSlice';
import { persistStore, persistReducer } from 'redux-persist'
import createIdbStorage from '@piotr-cz/redux-persist-idb-storage'
import { combineReducers } from 'redux';
import { enableMapSet } from 'immer';
import { connectRouter, routerMiddleware  } from 'connected-react-router';
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import connectionManager from '../connection';

export const history = createBrowserHistory()

enableMapSet();

// const meMapTransformer = createTransform<Map<string, Channel>, Array<[string, Channel]>>(
//   map => Array.from(map),
//   array => new Map(array),
//   { whitelist: [ 'channels' ] },
// );

const mePersistConfig = {
  key: 'me',
  storage: createIdbStorage({
    name: 'jlua',
    storeName: 'jluaStore',
    version: 1,
  }),
  // transforms: [meMapTransformer],
  debug: true,
}

// const channelMapTransformer = createTransform<Map<string, Message[]>, Array<[string, Message[]]>>(
//   map => Array.from(map),
//   array => new Map(array),
//   { whitelist: [ 'messages' ] },
// );

const channelPersistConfig = {
  key: 'channel',
  storage: createIdbStorage({
    name: 'jlua',
    storeName: 'jluaStore',
    version: 1,
  }),
  whitelist: [ 'messages' ],
  // transforms: [channelMapTransformer],
  debug: true,
}

const reducers = combineReducers({
  me: persistReducer<MeState>(mePersistConfig, meReducer),
  channel: persistReducer<ChannelState>(channelPersistConfig, channelReducer),
  application: applicationReducer,
  router: connectRouter(history),
  // system: systemReducer,
});

export const store = configureStore({
  reducer: reducers,
  middleware: [
    thunk,
    routerMiddleware(history),
    logger,
    connectionManager(),
  ],
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof reducers>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
