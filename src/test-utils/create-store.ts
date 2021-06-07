import {
  AnyAction,
  configureStore,
  EnhancedStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import { routerMiddleware } from 'connected-react-router';
import { createHashHistory } from 'history';
import thunk from 'redux-thunk';
import { reducers, RootState } from '../state/store';

export const history = createHashHistory();

const middleware = getDefaultMiddleware({
  immutableCheck: false,
  serializableCheck: false,
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createStore = (
  preloadedState: Partial<RootState> = {}
): EnhancedStore<RootState, AnyAction, typeof middleware> =>
  configureStore({
    preloadedState,
    reducer: reducers,
    middleware: [thunk, routerMiddleware(history)],
  });
