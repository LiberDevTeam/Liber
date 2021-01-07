import { Dispatch, MiddlewareAPI } from 'redux';
import { Message, Channel, addMessage, setChannelMessages } from '../features/channel/channelSlice';
import { addChannel } from '../features/me/meSlice';
import { v4 as uuidv4 } from 'uuid';
import Peer from 'simple-peer';

import {
  beginReconnect,
  broken,
  closed,
  error,
  open,
  reconnectAttempt,
  reconnected,
  send,
} from './actions';
import { Action } from './types';
import { downloadTorrent } from '../torrent';
import { Torrent } from 'webtorrent';
import { RootState } from '../app/store';

export default class ConnectionManager {
  // WebSocket connection.
  private websocket: WebSocket | null = null;

  // Keep track of how many times we've attempted to reconnect.
  private reconnectCount: number = 0;

  // We'll create an interval to try and reconnect if the socket connection breaks.
  private reconnectionInterval: NodeJS.Timeout | null = null;

  // Keep track of the last connect payload we used to connect, so that when we automatically
  // try to reconnect, we can reuse the previous connect payload.
  private lastConnectPayload: {
    url: string;
    protocols: string[] | undefined;
  } | null = null;

  // Keep track of if the WebSocket connection has ever successfully opened.
  private hasOpened = false;

  private pendingPeers: Record<string, { peer: Peer.Instance, uid: string}> = {};
  private chanParticipants: Record<string, Record<string, Peer.Instance>> = {}; 

  // WebSocket connect event handler.
  connect = ({ dispatch, getState }: MiddlewareAPI, { payload }: Action) => {
    this.close();

    this.lastConnectPayload = payload;
    this.websocket = new WebSocket(payload.url);

    this.websocket.addEventListener('close', (event) =>
      this.handleClose(dispatch, event)
    );
    this.websocket.addEventListener('onclose', (event) =>
      console.log('WebSocket is closed now.', event)
    )
    this.websocket.addEventListener('error', (event) =>
      this.handleError(dispatch, event)
    );
    this.websocket.addEventListener('open', (event) => {
      this.handleOpen(dispatch, event);
    });
    this.websocket.addEventListener('message', (event) =>{
      this.handleMessage({ dispatch, getState }, event);
    });
  };

  broadcastMessage = ({ dispatch }: MiddlewareAPI, { payload }: Action) => {
    const { cid, message } = payload;
    dispatch(addMessage({ cid, message }));
    this._broadcastMessage(payload.cid, payload.message);
  }

  _broadcastMessage = (cid: string, message: Message) => {
    (Object.entries(this.chanParticipants[cid]) || []).map(([_, peer]) => {
      peer.send(JSON.stringify({ type: 'message_broadcast', message }));
    })
  }

  // WebSocket disconnect event handler.
  disconnect = () => {
    this.websocket && this.close();
  };

  // WebSocket send event handler.
  send = (_: MiddlewareAPI, { payload }: Action) => {
    if (!this.websocket) return;
    const withRetry = (ws: WebSocket) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
        return;
      }
      setTimeout(() => withRetry(ws), 500);
    }
    withRetry(this.websocket);
  };

  createOffer = async ({ dispatch, getState }: MiddlewareAPI<Dispatch, RootState>, { payload }: Action) => {
    const peer = new Peer({ initiator: true })
    const { cid, me } = payload;
    const tx = uuidv4();
    peer.on('signal', data => {
      if (data.renegotiate || data.transceiverRequest) return;
      dispatch(send({
        tx,
        cid,
        uid: me.id,
        ...data,
      }));
    });

    peer.on('data', data => {
      this.onMessageReceived({ dispatch, getState }, cid, JSON.parse(data));
    })

    peer.on('close', () => {
      if (this.pendingPeers[tx]) {
        delete this.pendingPeers[tx];
      }
      if (this.chanParticipants[cid][me.id]) {
        delete this.chanParticipants[cid][me.id];
      }
    })

    peer.on('error', (err) => {
      console.log(err);
    })

    peer.on('connect', () => {
      this.chanParticipants[cid][this.pendingPeers[tx].uid] = peer;
      delete this.pendingPeers[tx];
    })

    if (!this.chanParticipants[cid]) {
      this.chanParticipants[cid] = {};
    }
    this.pendingPeers[tx] = { peer, uid: "" };
  }

  // Handle a close event.
  private handleClose = (dispatch: Dispatch, event: Event) => {
    dispatch(closed(event));

    // Conditionally attempt reconnection if enabled and applicable
    if (this.canAttemptReconnect()) {
      this.handleBrokenConnection(dispatch);
    }
  };

  // Handle an error event.
  private handleError = (dispatch: Dispatch, event: Event) => {
    console.log(event)
    dispatch(error(null, new Error(`${event}`)));
    if (this.canAttemptReconnect()) {
      this.handleBrokenConnection(dispatch);
    }
  };

  // Handle an open event.
  private handleOpen = (
    dispatch: Dispatch,
    event: Event
  ) => {
    // Clean up any outstanding reconnection attempts.
    if (this.reconnectionInterval) {
      clearInterval(this.reconnectionInterval);

      this.reconnectionInterval = null;
      this.reconnectCount = 0;

      dispatch(reconnected());
    }

    // Now we're fully open and ready to send messages.
    dispatch(open(event));

    // Track that we've been able to open the connection. We can use this flag
    // for error handling later, ensuring we don't try to reconnect when a
    // connection was never able to open in the first place.
    this.hasOpened = true;
  };

  // Handle a message event.
  private handleMessage = async (
    { dispatch, getState }: MiddlewareAPI<Dispatch, RootState>,
    event: MessageEvent,
  ) => {
    console.log("Message received ", event.data)
    const data = JSON.parse(event.data);
    const { tx, cid, uid } = data;
    if (!this.pendingPeers[data.tx]) {
      const me = getState().me;
      const peer = new Peer();
      this.pendingPeers[tx] = { peer, uid };
      peer.on('signal', data => {
        if (data.renegotiate || data.transceiverRequest) return;
        dispatch(send({
          tx,
          cid,
          uid: me.id,
          ...data,
        }));
      })
      peer.on('connect', () => {
        console.log("connected")
        this.chanParticipants[cid][uid] = peer;
        delete this.pendingPeers[tx];

        const messages = getState().channel.messages[cid];
        peer.send(JSON.stringify({
          type: 'initial',
          channel: {
            ...me.channels[cid],
            messages,
          }
        }));
      })

      peer.on('data', data => {
        this.onMessageReceived({ dispatch, getState }, cid, JSON.parse(data))
      });

      peer.on('close', () => {
        if (this.pendingPeers[tx]) {
          delete this.pendingPeers[tx];
        }
        if (this.chanParticipants[cid] && this.chanParticipants[cid][uid]) {
          delete this.chanParticipants[cid][uid];
        }
      })

      peer.on('error', (err) => {
        console.log(err);
      })
    }

    if (!this.pendingPeers[tx].uid) {
      this.pendingPeers[tx].uid = uid;
    }

    // delete data.tx
    // delete data.cid
    // delete data.uid
    this.pendingPeers[tx].peer.signal(data)
  };

  private onMessageReceived = (
    { dispatch, getState }: MiddlewareAPI<Dispatch, RootState>,
    cid: string,
    data: {
      type: string,
      channel: Channel & { messages: Message[] },
      message: Message,
    }
  ) => {
    const messagesIndex = getState().channel.messagesIndex;

    console.log("Message Received ", data)
    switch (data.type) {
      case 'initial':
        dispatch(addChannel(data.channel));
        const messages = data.channel.messages;
        dispatch(setChannelMessages({ cid, messages }));
        break;
      case 'message_broadcast':
        if (messagesIndex[data.message.id]) {
          return;
        }
        console.log("Message Broadcast", data)
        const message = data.message;
        dispatch(addMessage({ cid, message }))
        this._broadcastMessage(cid, message);

        // if (data.message.attachment) {
        //   downloadTorrent((torrent: Torrent) => {
        //     torrent.files.map(f => {
        //       f.appendTo(`#at-${data.message.id}`)
        //     });
        //   })(data.message.attachment)
        // }
        break;
    }
  }

  // Close the WebSocket connection.
  private close = () => {
    if (this.websocket) {
      this.websocket.close(1000);

      this.websocket = null;
      this.hasOpened = false;
    }
  };

  // Handle a broken socket connection.
  private handleBrokenConnection = (dispatch: Dispatch) => {
    this.websocket = null;

    // First, dispatch actions to notify Redux that our connection broke.
    dispatch(broken());
    dispatch(beginReconnect());

    this.reconnectCount = 1;

    dispatch(reconnectAttempt(this.reconnectCount));

    // Attempt to reconnect immediately by calling connect with assertions
    // that the arguments conform to the types we expect.
    this.connect(
      { dispatch } as MiddlewareAPI,
      { payload: this.lastConnectPayload } as Action
    );

    // Attempt reconnecting on an interval.
    this.reconnectionInterval = setInterval(() => {
      this.reconnectCount += 1;

      dispatch(reconnectAttempt(this.reconnectCount));

      // Call connect again, same way.
      this.connect(
        { dispatch } as MiddlewareAPI,
        { payload: this.lastConnectPayload } as Action
      );
    }, 2000);
  };

  // Only attempt to reconnect if the connection has ever successfully opened,
  // and we're not currently trying to reconnect.
  //
  // This prevents ongoing reconnect loops to connections that have not
  // successfully opened before, such as net::ERR_CONNECTION_REFUSED errors.
  //
  // This also prevents starting multiple reconnection attempt loops.
  private canAttemptReconnect(): boolean {
    return this.hasOpened && this.reconnectionInterval == null;
  }
}