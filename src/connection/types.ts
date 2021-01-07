import { Message } from '../features/channel/channelSlice';
import { Me } from '../features/me/meSlice';
import {
  WEBSOCKET_CLOSED,
  WEBSOCKET_MESSAGE,
  WEBSOCKET_OPEN,
 
  WEBSOCKET_CONNECT,
  WEBSOCKET_DISCONNECT,
  WEBSOCKET_SEND,

  BROADCAST_MESSAGE,
  RTC_CREATE_OFFER,
} from './actionTypes'

export type ActionType =
  | typeof WEBSOCKET_CLOSED
  | typeof WEBSOCKET_CONNECT
  | typeof WEBSOCKET_DISCONNECT
  | typeof WEBSOCKET_MESSAGE
  | typeof WEBSOCKET_OPEN
  | typeof WEBSOCKET_SEND;

export type Action =
  | { type: typeof WEBSOCKET_CLOSED; payload: any; meta?: any }
  | { type: typeof WEBSOCKET_CONNECT; payload: any; meta?: any }
  | { type: typeof WEBSOCKET_DISCONNECT; payload: any; meta?: any }
  | { type: typeof WEBSOCKET_MESSAGE; payload: any; meta?: any }
  | { type: typeof WEBSOCKET_OPEN; payload: any; meta?: any }
  | { type: typeof WEBSOCKET_SEND; payload: any; meta?: any }
  | { type: typeof BROADCAST_MESSAGE; payload: { cid: String, message: Message }; meta?: any }
  | { type: typeof RTC_CREATE_OFFER; payload: { cid: String, me: Me }; meta?: any };