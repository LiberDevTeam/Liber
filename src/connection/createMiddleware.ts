import { Middleware, MiddlewareAPI } from 'redux';

import { Action } from './types';
import { error } from './actions';
import {
  WEBSOCKET_CONNECT,
  WEBSOCKET_DISCONNECT,
  WEBSOCKET_SEND,
  RTC_CREATE_OFFER,
  BROADCAST_MESSAGE,
  CM_PREFIX,
} from './actionTypes';
import ConnectionManager from './ConnectionManager';

export default function createMiddleware(): Middleware {

  const cm = new ConnectionManager();

  // Define the list of handlers, now that we have an instance of ReduxWebSocket.
  const handlers = {
    [WEBSOCKET_CONNECT]:    cm.connect,
    [WEBSOCKET_DISCONNECT]: cm.disconnect,
    [WEBSOCKET_SEND]:       cm.send,
    [BROADCAST_MESSAGE]:    cm.broadcastMessage,
    [RTC_CREATE_OFFER]:     cm.createOffer,
  };

  // Middleware function.
  return (store: MiddlewareAPI) => (next) => (action: Action) => {
    const { dispatch } = store;
    const { type: actionType } = action;

    // Check if action type matches prefix
    if (actionType && actionType.includes(CM_PREFIX)) {
      const handler = Reflect.get(handlers, actionType);

      if (handler) {
        try {
          handler(store, action);
        } catch (err) {
          console.log(err)
          dispatch(error(action, err));
        }
      }
    }

    return next(action);
  };
};
