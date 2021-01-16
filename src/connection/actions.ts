import { Message } from '~/features/channel/channelSlice';
import { Me } from '~/features/me/meSlice';
import {
  WEBSOCKET_BEGIN_RECONNECT,
  WEBSOCKET_RECONNECT_ATTEMPT,
  WEBSOCKET_RECONNECTED,
  WEBSOCKET_BROKEN,
  WEBSOCKET_CLOSED,
  WEBSOCKET_ERROR,
  WEBSOCKET_OPEN,
  WEBSOCKET_CONNECT,
  WEBSOCKET_DISCONNECT,
  WEBSOCKET_SEND,
  BROADCAST_MESSAGE,
  RTC_CREATE_OFFER,
} from './actionTypes';
import { Action } from './types';

type BuiltAction<T> = {
  type: string;
  meta: {
    timestamp: Date;
  };
  payload?: T;
};

// Create an FSA compliant action.
function buildAction<T>(
  actionType: string,
  payload?: T,
  meta?: any
): BuiltAction<T> {
  const base = {
    type: actionType,
    meta: {
      timestamp: new Date(),
      ...meta,
    },
    // Mixin the `error` key if the payload is an Error.
    ...(payload instanceof Error ? { error: true } : null),
  };

  return payload ? { ...base, payload } : base;
}

// Action creators for user dispatched actions. These actions are all optionally
export const connect = (
  url: string,
  me: Me
): BuiltAction<{ url: string; me: Me }> =>
  buildAction(WEBSOCKET_CONNECT, { url, me });
export const disconnect = (): BuiltAction<any> =>
  buildAction(WEBSOCKET_DISCONNECT);
export const send = (msg: any): BuiltAction<any> =>
  buildAction(WEBSOCKET_SEND, msg);

// Action creators for actions dispatched by redux-websocket. All of these must
// take a prefix. The default prefix should be used unless a user has created
// this middleware with the prefix option set.
export const beginReconnect = (): BuiltAction<any> =>
  buildAction(WEBSOCKET_BEGIN_RECONNECT);
export const reconnectAttempt = (
  count: number
): BuiltAction<{ count: number }> =>
  buildAction(WEBSOCKET_RECONNECT_ATTEMPT, { count });
export const reconnected = (): BuiltAction<any> =>
  buildAction(WEBSOCKET_RECONNECTED);
export const open = (event: Event): BuiltAction<Event> =>
  buildAction(WEBSOCKET_OPEN, event);
export const broken = (): BuiltAction<any> => buildAction(WEBSOCKET_BROKEN);
export const closed = (event: Event): BuiltAction<Event> =>
  buildAction(WEBSOCKET_CLOSED, event);
export const error = (
  originalAction: Action | null,
  err: Error
): BuiltAction<Error> =>
  buildAction(WEBSOCKET_ERROR, err, {
    message: err.message,
    name: err.name,
    originalAction,
  });

export const rtcCreateOffer = (
  cid: string,
  me: Me
): BuiltAction<{ cid: string; me: Me }> =>
  buildAction(RTC_CREATE_OFFER, { cid, me });
export const broadcastMessage = (
  cid: string,
  message: Message
): BuiltAction<{ cid: string; message: Message }> =>
  buildAction(BROADCAST_MESSAGE, { cid, message });
