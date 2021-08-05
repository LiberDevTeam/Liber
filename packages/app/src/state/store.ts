import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { StoreEnhancer } from 'redux';
import devToolsEnhancer from 'remote-redux-devtools';
import { AppDB, appDB } from '~/lib/db';
import { reducers } from './reducers';

const enhancers: StoreEnhancer[] = [];

// @ts-ignore
if (process.env.ENABLE_REMOTE_DEBUG && !window.devToolsExtension) {
  enhancers.push(devToolsEnhancer({ realtime: true, port: 8000 }));
}

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: { extraArgument: { db: appDB } } }),
  enhancers,
});

export interface ThunkExtra {
  db: AppDB;
}

export type RootState = ReturnType<typeof reducers>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  ThunkExtra,
  Action<string>
>;
export type AppDispatch = typeof store.dispatch;
