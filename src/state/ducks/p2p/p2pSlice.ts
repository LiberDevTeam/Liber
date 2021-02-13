import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '~/state/store';
import IPFS, { IPFS as Ipfs } from 'ipfs';
import { publicLibp2pOptions } from '~/lib/libp2p';
import uint8ArrayToString from 'uint8arrays/to-string';
import uint8ArrayFromString from 'uint8arrays/from-string';
import {
  addMessage,
  addPlace,
  Message,
  Place,
  setMessages,
} from '../place/placeSlice';
import { push } from 'connected-react-router';
import promiseRetry from 'promise-retry';

export type P2PState = {
  ipfsNode: Ipfs | null;
  privateIpfsNodes: Record<string, Ipfs>;
};

export const initNodes = createAsyncThunk<
  P2PState,
  void,
  { dispatch: AppDispatch; state: RootState }
>('p2p/initNodes', async (_, thunkAPI) => {
  const { dispatch } = thunkAPI;
  const {
    place: { places, messages },
  } = thunkAPI.getState();

  // @ts-ignore
  const ipfsNode = await IPFS.create({
    libp2p: publicLibp2pOptions,
  });

  const privateIpfsNodes: Record<string, Ipfs> = {};

  Object.keys(places).forEach(async (pid) => {
    if (places[pid].isPrivate) {
      // TODO
    } else {
      setupNode(ipfsNode, messages[pid], places[pid], pid, dispatch);
    }
  });

  return {
    ipfsNode,
    privateIpfsNodes,
  };
});

function publishMessageTopic(pid: string) {
  return `/liber/places/${pid}/publish_message/1.0.0`;
}

function joinedPlaceTopic(peerId: string, pid: string) {
  return `/liber/p/${peerId}/places/${pid}/joined/1.0.0`;
}

function welcomePlaceTopic(peerId: string, pid: string) {
  return `/liber/p/${peerId}/places/${pid}/welcome/1.0.0`;
}

async function setupNode(
  node: Ipfs,
  messages: Message[],
  place: Place,
  pid: string,
  dispatch: AppDispatch
) {
  node.pubsub.subscribe(publishMessageTopic(pid), (msg) => {
    const message: Message = JSON.parse(uint8ArrayToString(msg.data));
    dispatch(addMessage({ pid, message }));
  });

  const peerId = (await node.id()).id;
  node.pubsub.subscribe(joinedPlaceTopic(peerId, pid), (msg) => {
    console.log('received');
    console.log(msg);
    const { peerId } = JSON.parse(uint8ArrayToString(msg.data));
    node.pubsub.publish(
      welcomePlaceTopic(peerId, pid),
      uint8ArrayFromString(JSON.stringify({ messages, place })),
      {}
    );
  });
}

export const publishMessage = createAsyncThunk<
  void,
  { pid: string; message: Message },
  { dispatch: AppDispatch; state: RootState }
>('p2p/publishMessage', async ({ pid, message }, thunkAPI) => {
  const state = thunkAPI.getState();
  const { places } = state.place;

  (places[pid].isPrivate
    ? state.p2p.privateIpfsNodes[pid]
    : state.p2p.ipfsNode
  )?.pubsub.publish(
    publishMessageTopic(pid),
    uint8ArrayFromString(JSON.stringify(message)),
    {}
  );
});

export const joinPlace = createAsyncThunk<
  void,
  {
    pid: string;
    swarmId: string | null;
    peerId: string;
  },
  { dispatch: AppDispatch; state: RootState }
>('p2p/joinPlace', async ({ pid, swarmId, peerId }, thunkAPI) => {
  const { dispatch } = thunkAPI;
  const {
    p2p: { ipfsNode },
    place: { places, messages },
  } = thunkAPI.getState();

  const node = ipfsNode!;

  setupNode(node, messages[pid], places[pid], pid, dispatch);

  const myPeerId = (await node.id()).id;
  node.pubsub.subscribe(welcomePlaceTopic(myPeerId, pid), (msg) => {
    const { place, messages } = JSON.parse(uint8ArrayToString(msg.data));
    dispatch(addPlace(place));
    dispatch(setMessages({ pid, messages }));
    node.pubsub.unsubscribe(welcomePlaceTopic(myPeerId, pid));

    dispatch(push(`/places/${pid}`));
  });

  // retry until one peer is connected at least
  promiseRetry((retry) => {
    return new Promise((resolve, reject) =>
      node.pubsub.peers(joinedPlaceTopic(peerId!, pid)).then((peers) => {
        if (peers.length === 0) {
          reject(new Error('peers are still not connected'));
        } else {
          resolve(peers);
        }
      })
    ).catch((err) => retry(err));
  }).then(() => {
    node.pubsub.publish(
      joinedPlaceTopic(peerId!, pid),
      uint8ArrayFromString(JSON.stringify({ peerId: myPeerId })),
      {}
    );
  });
});

const initialState: P2PState = {
  ipfsNode: null,
  privateIpfsNodes: {},
};

export const p2pSlice = createSlice({
  name: 'p2p',
  initialState,
  reducers: {
    addPrivateLibp2pNode: (
      state,
      action: PayloadAction<{ pid: string; node: Ipfs }>
    ) => {
      const { pid, node } = action.payload;
      state.privateIpfsNodes[pid] = node;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initNodes.fulfilled, (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    });
  },
});

export const { addPrivateLibp2pNode } = p2pSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = (amount: number): AppThunk => dispatch => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state: RootState) => state.counter.value;
export const selectP2P = (state: RootState): typeof state.me => state.me;

export default p2pSlice.reducer;
