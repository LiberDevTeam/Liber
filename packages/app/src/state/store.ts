import {
  Action,
  AnyAction,
  configureStore,
  isRejected,
  Middleware,
  ThunkAction,
} from '@reduxjs/toolkit';
import { StoreEnhancer } from 'redux';
import { createLogger } from 'redux-logger';
import devToolsEnhancer from 'remote-redux-devtools';
import { AppDB, appDB } from '~/lib/db';
import { reducers } from './reducers';

const enhancers: StoreEnhancer[] = [];

// @ts-ignore
if (process.env.ENABLE_REMOTE_DEBUG && !window.devToolsExtension) {
  enhancers.push(devToolsEnhancer({ realtime: true, port: 8000 }));
}

const additionalMiddlewares: Middleware[] = [];

if (process.env.NODE_ENV === 'development') {
  const check = isRejected();
  const logger = createLogger({
    level: {
      action: 'log',
      error: 'error',
      prevState: false,
      nextState: false,
    },
    predicate: (_, action) => check(action),
    logger: {
      log: (_: unknown, _0: unknown, action: AnyAction) => {
        if (check(action)) {
          console.error(action.type);
          console.error(action.error.stack);
        }
      },
    },
  });
  additionalMiddlewares.push(logger);
}

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: { extraArgument: { db: appDB } } }).concat(
      additionalMiddlewares
    ),
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
