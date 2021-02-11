import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '~/state/store';
import IPFS, { IPFS as Ipfs } from 'ipfs';
import Libp2p from 'libp2p';
import { createLibp2pNode, createPnetLibp2pNode } from '~/lib/libp2p';
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

export type P2PState = {
  ipfsNode: Ipfs | null;
  publicLibp2pNode: Libp2p | null;
  privateLibp2pNodes: Record<string, Libp2p>;
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

  const publicLibp2pNode = await createLibp2pNode();
  await publicLibp2pNode.start();

  const privateLibp2pNodes: Record<string, Libp2p> = {};
  Object.keys(places).forEach(async (pid) => {
    if (places[pid].isPrivate) {
      const node = await createPnetLibp2pNode(places[pid].swarmKey);
      await node.start();

      setupNode(node, messages[pid], places[pid], pid, dispatch);

      privateLibp2pNodes[pid] = node;
    } else {
      setupNode(publicLibp2pNode, messages[pid], places[pid], pid, dispatch);
    }
  });

  const ipfsNode = await IPFS.create();
  if (!ipfsNode.isOnline) {
    await ipfsNode.start();
  }

  return {
    ipfsNode,
    publicLibp2pNode,
    privateLibp2pNodes,
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
  node: Libp2p,
  messages: Message[],
  place: Place,
  pid: string,
  dispatch: AppDispatch
) {
  node.pubsub.on(publishMessageTopic(pid), (msg) => {
    const message: Message = JSON.parse(uint8ArrayToString(msg.data));
    dispatch(addMessage({ pid, message }));
  });
  node.pubsub.subscribe(publishMessageTopic(pid));

  const peerId = node.peerId.toB58String();
  node.pubsub.on(joinedPlaceTopic(peerId, pid), (msg) => {
    const { peerId } = JSON.parse(uint8ArrayToString(msg.data));
    node.pubsub.publish(
      welcomePlaceTopic(peerId, pid),
      uint8ArrayFromString(JSON.stringify({ messages, place }))
    );
  });
  node.pubsub.subscribe(joinedPlaceTopic(peerId, pid));
  console.log(node.pubsub.getTopics());
}

export const publishMessage = createAsyncThunk<
  void,
  { pid: string; message: Message },
  { dispatch: AppDispatch; state: RootState }
>('p2p/publishMessage', async ({ pid, message }, thunkAPI) => {
  const state = thunkAPI.getState();
  const { places } = state.place;

  (places[pid].isPrivate
    ? state.p2p.privateLibp2pNodes[pid]
    : state.p2p.publicLibp2pNode
  )?.pubsub.publish(
    publishMessageTopic(pid),
    uint8ArrayFromString(JSON.stringify(message))
  );

  thunkAPI.dispatch(addMessage({ pid, message }));
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
    p2p: { publicLibp2pNode },
    place: { places, messages },
  } = thunkAPI.getState();

  let node: Libp2p;
  if (swarmId) {
    node = await createPnetLibp2pNode(swarmId);
    await node.start();
  } else {
    node = publicLibp2pNode!;
    console.log(publicLibp2pNode);
  }

  setupNode(node, messages[pid], places[pid], pid, dispatch);

  node.pubsub.subscribe(welcomePlaceTopic(node.peerId.toB58String(), pid));
  node.pubsub.on(welcomePlaceTopic(node.peerId.toB58String(), pid), (msg) => {
    const { place, messages } = JSON.parse(uint8ArrayToString(msg.data));
    dispatch(addPlace(place));
    dispatch(setMessages({ pid, messages }));
    node.pubsub.unsubscribe(welcomePlaceTopic(node.peerId.toB58String(), pid));
  });

  node.pubsub.publish(
    joinedPlaceTopic(peerId!, pid),
    uint8ArrayFromString(JSON.stringify({ peerId: node.peerId.toB58String() }))
  );

  dispatch(addPrivateLibp2pNode({ pid, node }));

  dispatch(push(`/places/${pid}`));
});

const initialState: P2PState = {
  ipfsNode: null,
  publicLibp2pNode: null,
  privateLibp2pNodes: {},
};

export const p2pSlice = createSlice({
  name: 'p2p',
  initialState,
  reducers: {
    addPrivateLibp2pNode: (
      state,
      action: PayloadAction<{ pid: string; node: Libp2p }>
    ) => {
      const { pid, node } = action.payload;
      state.privateLibp2pNodes[pid] = node;
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
