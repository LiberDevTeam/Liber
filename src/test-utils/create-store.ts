import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createHashHistory } from 'history';
import { reducers, RootState } from '../state/store';

export const history = createHashHistory();

const middleware = [
  ...getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  }),
] as const;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createStore = (preloadedState: Partial<RootState> = {}) =>
  configureStore({
    preloadedState,
    reducer: reducers,
    middleware,
  });
