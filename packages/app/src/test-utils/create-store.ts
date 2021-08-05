import { configureStore } from '@reduxjs/toolkit';
import { createHashHistory } from 'history';
import { AppDB } from '~/lib/db';
import { reducers } from '~/state/reducers';
import type { RootState } from '../state/store';

export const history = createHashHistory();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createStore = (
  preloadedState: Partial<RootState> = {},
  appDB: any = {}
) =>
  configureStore({
    preloadedState,
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: { extraArgument: { db: appDB as AppDB } },
      }),
  });
