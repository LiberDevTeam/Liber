import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '~/state/store';
import IPFS, { IPFS as Ipfs } from 'ipfs';
import { publicLibp2pOptions } from '~/lib/libp2p';
import uint8ArrayToString from 'uint8arrays/to-string';
import uint8ArrayFromString from 'uint8arrays/from-string';
import {
  placeAdded,
  selectAllPlaces,
  selectPlaceById,
  selectPlaceMessages,
  selectPlaceMessagesByPID,
} from '../places/placesSlice';
import { Message, placeMessageAdded } from '../places/messagesSlice';
import { push } from 'connected-react-router';
import { createFromPubKey } from 'peer-id';
import multiaddr from 'multiaddr';
import pipe from 'it-pipe';
import { v4 as uuidv4 } from 'uuid';
import getUnixTime from 'date-fns/getUnixTime';
import all from 'it-all';
import uint8ArrayConcat from 'uint8arrays/concat';
import { ipfsContentAdded } from './ipfsContentsSlice';

const publishPlaceMessageTopic = (pid: string) => {
  return `/liber/places/${pid}/messages/publish/1.0.0`;
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
  const state = thunkAPI.getState();

  p2pNodes.ipfsNode = await IPFS.create({
    libp2p: publicLibp2pOptions,
  });

  selectAllPlaces(state).forEach(async (place) => {
    if (place.swarmKey) {
      // TODO
      // p2pNodes.privateIpfsNodes[pid] = IPFS.create({});
    } else {
      const messages = selectPlaceMessages(place)(state);

      const node = ipfsNode();
      subscribePublishPlaceMessageTopic(node, place.id, dispatch);

      // @ts-ignore
      node.libp2p.handle(
        joinPlaceProtocol(place.id),
        ({ stream, connection }) => {
          // TODO(kyfk): validate a peer id is the same being invited.
          // const peerId = connection.remotePeer.toB58String();
          pipe([JSON.stringify({ messages, place })], stream);
        }
      );
    }
  });

  console.log((await p2pNodes.ipfsNode.id()).publicKey);
  console.log((await p2pNodes.ipfsNode.id()).addresses[0].toString());
});

async function subscribePublishPlaceMessageTopic(
  node: Ipfs,
  pid: string,
  dispatch: AppDispatch
) {
  node.pubsub.subscribe(publishPlaceMessageTopic(pid), async (msg) => {
    const message: Message = JSON.parse(uint8ArrayToString(msg.data));
    if (message.ipfsCID) {
      // @ts-ignore
      for await (const entry of ipfsNode().get(message.ipfsCID)) {
        if (entry.type === 'dir' || !entry.content) continue;
        const blob = new Blob([uint8ArrayConcat(await all(entry.content!))], {
          type: 'application/octet-binary',
        });
        const file = new File([blob], entry.path);
        const cid = entry.cid.toBaseEncodedString();
        message.ipfsCID = cid;
        dispatch(placeMessageAdded({ pid, message }));
        const dataURL = await readAsDataURL(file);
        dispatch(
          ipfsContentAdded({
            cid,
            dataURL,
            file,
          })
        );
        message.content = dataURL;
      }
    }
    dispatch(placeMessageAdded({ pid, message }));
  });
}

export const publishPlaceMessage = createAsyncThunk<
  void,
  { pid: string; message: Message; file?: File },
  { dispatch: AppDispatch; state: RootState }
>('p2p/publishPlaceMessage', async ({ pid, message, file }, thunkAPI) => {
  const { dispatch } = thunkAPI;
  const state = thunkAPI.getState();

  if (file) {
    const content = await ipfsNode().add({
      path: file.name,
      content: file,
    });
    const cid = content.cid.toBaseEncodedString();
    message.ipfsCID = cid;
    const dataURL = await readAsDataURL(file);
    message.content = dataURL;
    dispatch(
      ipfsContentAdded({
        cid,
        dataURL,
        file,
      })
    );
  }

  (selectPlaceById(pid)(state)?.swarmKey
    ? privateIpfsNodes(pid)
    : ipfsNode()
  )?.pubsub.publish(
    publishPlaceMessageTopic(pid),
    uint8ArrayFromString(JSON.stringify(message)),
    {}
  );

  dispatch(placeMessageAdded({ pid, message }));
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

  const remotePeer = await createFromPubKey(pubKey);

  const node = ipfsNode();

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

      dispatch(placeAdded({ place, messages }));

      subscribePublishPlaceMessageTopic(node, pid, dispatch);

      // @ts-ignore
      node.libp2p.handle(joinPlaceProtocol(pid), ({ stream, connection }) => {
        // TODO(kyfk): validate a peer id is the same being invited.
        // const peerId = connection.remotePeer.toB58String();
        pipe([JSON.stringify({ messages, place })], stream);
      });

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
    const { dispatch } = thunkAPI;

    const file = await ipfsNode().add({
      path: avatarImage.name,
      content: avatarImage,
    });

    let swarmKey;
    if (isPrivate) {
      // TODO
      // const swarmKey = uuidv4()
      // p2pNodes.privateIpfsNodes[id] = await IPFS.create({})
    }

    const id = uuidv4();

    const nid = await ipfsNode().id();

    const cid = file.cid.toBaseEncodedString();

    // TODO
    const invitationUrl = new URL(`https://localhost:3000`);
    invitationUrl.searchParams.append('pid', id);
    nid.addresses.map((addr) => {
      invitationUrl.searchParams.append('addrs', addr.toString());
    });
    invitationUrl.searchParams.append('pubKey', nid.publicKey);

    const dataURL = await readAsDataURL(avatarImage);

    const timestamp = getUnixTime(new Date());
    const place = {
      id,
      name,
      description,
      avatarImage: dataURL,
      avatarImageCID: cid,
      lastActedAt: timestamp,
      createdAt: timestamp,
      messageIds: [],
      swarmKey: swarmKey || undefined,
      invitationUrl: invitationUrl.href,
    };

    dispatch(placeAdded({ place, messages: [] }));

    dispatch(
      ipfsContentAdded({
        cid,
        dataURL,
        file: avatarImage,
      })
    );

    dispatch(push(`/places/${id}`));
  }
);

const readAsDataURL = (file: File) => {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        resolve(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  });
};

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
