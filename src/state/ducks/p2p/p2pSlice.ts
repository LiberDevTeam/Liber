import { createAsyncThunk } from '@reduxjs/toolkit';
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
import { createFromPubKey } from 'peer-id';
import multiaddr from 'multiaddr';
import pipe from 'it-pipe';
import { v4 as uuidv4 } from 'uuid';
import getUnixTime from 'date-fns/getUnixTime';

const publishMessageTopic = (pid: string) => {
  return `/liber/places/${pid}/publish_message/1.0.0`;
};

const joinPlaceProtocol = (pid: string) => {
  return `/liber/places/${pid}/join/1.0.0`;
};

const p2pNodes: {
  ipfsNode: Ipfs | null;
  privateIpfsNodes: Record<string, Ipfs>;
} = {
  ipfsNode: null,
  privateIpfsNodes: {},
};

export const ipfsNode = () => p2pNodes.ipfsNode!;
export const privateIpfsNodes = (pid: string) => p2pNodes.privateIpfsNodes[pid];

export const initNodes = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState }
>('p2p/initNodes', async (_, thunkAPI) => {
  const { dispatch } = thunkAPI;
  const {
    place: { places, messages },
  } = thunkAPI.getState();

  p2pNodes.ipfsNode = await IPFS.create({
    libp2p: publicLibp2pOptions,
  });

  Object.keys(places).forEach(async (pid) => {
    if (places[pid].swarmKey) {
      // TODO
      // p2pNodes.privateIpfsNodes[pid] = IPFS.create({});
    } else {
      setupNode(p2pNodes.ipfsNode!, messages[pid], places[pid], pid, dispatch);
    }
  });

  console.log((await p2pNodes.ipfsNode.id()).publicKey);
  console.log((await p2pNodes.ipfsNode.id()).addresses[0].toString());
});

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

  // @ts-ignore
  node.libp2p.handle(joinPlaceProtocol(pid), ({ stream, connection }) => {
    // TODO(kyfk): validate a peer id is the same being invited.
    // const peerId = connection.remotePeer.toB58String();
    pipe([JSON.stringify({ messages, place })], stream);
  });
}

export const publishMessage = createAsyncThunk<
  void,
  { pid: string; message: Message },
  { dispatch: AppDispatch; state: RootState }
>('p2p/publishMessage', async ({ pid, message }, thunkAPI) => {
  const state = thunkAPI.getState();
  const { places } = state.place;

  (places[pid].swarmKey ? privateIpfsNodes(pid) : ipfsNode())?.pubsub.publish(
    publishMessageTopic(pid),
    uint8ArrayFromString(JSON.stringify(message)),
    {}
  );
});

export const joinPlace = createAsyncThunk<
  void,
  {
    pid: string;
    pubKey: string;
    swarmKey: string | undefined;
    addrs: string[];
  },
  { dispatch: AppDispatch; state: RootState }
>('p2p/joinPlace', async ({ pid, swarmKey, pubKey, addrs }, thunkAPI) => {
  const { dispatch } = thunkAPI;
  const {
    place: { places, messages },
  } = thunkAPI.getState();

  const node = ipfsNode();

  setupNode(node, messages[pid], places[pid], pid, dispatch);

  const remotePeer = await createFromPubKey(pubKey);

  // @ts-ignore
  node.libp2p.peerStore.addressBook.add(
    remotePeer,
    addrs.map((addr) => multiaddr(addr))
  );

  // @ts-ignore
  node.libp2p.peerStore.protoBook.set(remotePeer, joinPlaceProtocol(pid));

  // TODO(kyfk): retry connect with the remote peer invited the user when a connection refused.
  // @ts-ignore
  const { stream } = await node.libp2p.dialProtocol(
    remotePeer,
    joinPlaceProtocol(pid),
    {}
  );
  pipe(stream, async (source) => {
    for await (const message of source) {
      const { messages, place } = JSON.parse(message.toString());
      dispatch(setMessages({ pid, messages }));
      dispatch(addPlace(place));
      dispatch(push(`/places/${pid}`));
      return;
    }
  });
});

export const createNewPlace = createAsyncThunk<
  void,
  {
    name: string;
    description: string;
    isPrivate: boolean;
    avatarImage: File;
  },
  { dispatch: AppDispatch; state: RootState }
>(
  'p2p/createNewPlace',
  async ({ name, description, isPrivate, avatarImage }, thunkAPI) => {
    image = avatarImage;
    const { dispatch } = thunkAPI;

    const id = uuidv4();

    const file = await ipfsNode().add({
      path: image.name,
      content: image,
    });
    // console.log(file)

    if (isPrivate) {
      // TODO
      // const swarmKey = uuidv4()
      // p2pNodes.privateIpfsNodes[id] = await IPFS.create({})
    }

    dispatch(
      addPlace({
        id,
        name,
        description,
        avatarImage: ``,
        timestamp: getUnixTime(new Date()),
      })
    );

    dispatch(push(`/places/${id}`));
  }
);

let image;

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
