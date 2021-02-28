import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '~/state/store';
import IPFS, { IPFS as Ipfs } from 'ipfs';
import { publicLibp2pOptions } from '~/lib/libp2p';
import uint8ArrayToString from 'uint8arrays/to-string';
import uint8ArrayFromString from 'uint8arrays/from-string';
import {
  Place,
  selectAllPlaces,
  selectPlaceById,
  selectPlaceMessages,
} from '~/state/ducks/places/placesSlice';
import { Message } from '~/state/ducks/places/messagesSlice';
import { push } from 'connected-react-router';
import { createFromPubKey } from 'peer-id';
import multiaddr from 'multiaddr';
import pipe from 'it-pipe';
import { v4 as uuidv4 } from 'uuid';
import getUnixTime from 'date-fns/getUnixTime';
import all from 'it-all';
import uint8ArrayConcat from 'uint8arrays/concat';
import { ipfsContentAdded } from '~/state/ducks/p2p/ipfsContentsSlice';
import { Me } from '~/state/ducks/me/meSlice';
import { placeMessageAdded, placeAdded } from '~/state/actionCreater';

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

  selectAllPlaces(state).forEach((place) => {
    if (place.swarmKey) {
      // TODO
      // p2pNodes.privateIpfsNodes[pid] = IPFS.create({});
    } else {
      const messages = selectPlaceMessages(place)(state);

      const node = ipfsNode();
      subscribePublishPlaceMessageTopic(node, place.id, state.me, dispatch);

      handleJoinPlaceProtocol(node, place, messages);
    }
  });

  console.log((await p2pNodes.ipfsNode.id()).publicKey);
  console.log((await p2pNodes.ipfsNode.id()).addresses[0].toString());
});

const subscribePublishPlaceMessageTopic = (
  node: Ipfs,
  pid: string,
  me: Me,
  dispatch: AppDispatch
) => {
  node.pubsub.subscribe(publishPlaceMessageTopic(pid), async (msg) => {
    const message: Message = JSON.parse(uint8ArrayToString(msg.data));
    if (message.authorId === me.id) return;
    if (message.contentIpfsCID) {
      message.contentUrl = await addIpfsContent(
        dispatch,
        message.contentIpfsCID
      );
    }
    dispatch(placeMessageAdded({ pid, message, mine: false }));
  });
};

export const publishPlaceMessage = createAsyncThunk<
  void,
  { pid: string; message: Message; file?: File },
  { dispatch: AppDispatch; state: RootState }
>('p2p/publishPlaceMessage', async ({ pid, message, file }, thunkAPI) => {
  const { dispatch } = thunkAPI;
  const state = thunkAPI.getState();

  const msg = { ...message };

  if (file) {
    const content = await ipfsNode().add({
      path: file.name,
      content: file,
    });
    const cid = content.cid.toBaseEncodedString();
    const dataUrl = await readAsDataURL(file);
    dispatch(
      ipfsContentAdded({
        cid,
        dataUrl,
        file,
      })
    );
    msg.contentIpfsCID = cid;
    msg.contentUrl = dataUrl;
  }

  (selectPlaceById(pid)(state)?.swarmKey
    ? privateIpfsNodes(pid)
    : ipfsNode()
  )?.pubsub.publish(
    publishPlaceMessageTopic(pid),
    uint8ArrayFromString(JSON.stringify(msg)),
    {}
  );

  dispatch(placeMessageAdded({ pid, message: msg, mine: true }));
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
  const { me } = thunkAPI.getState();

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
  await pipe(stream, async (source) => {
    const message = [];
    for await (const chunk of source) {
      message.push(chunk);
    }

    const {
      messages,
      place,
    }: { messages: Message[]; place: Place } = JSON.parse(message.toString());

    const messagesWithDataUrl = await Promise.all(
      messages.map(async (m) => {
        if (m.contentIpfsCID) {
          m.contentUrl = await addIpfsContent(dispatch, m.contentIpfsCID);
        }
        return m;
      })
    );

    const avatarImage = await addIpfsContent(dispatch, place.avatarImageCID);
    if (avatarImage) {
      place.avatarImage = avatarImage;
    }

    place.invitationUrl = (await buildInvitationUrl(node, pid)).href;

    dispatch(placeAdded({ place, messages: messagesWithDataUrl }));

    subscribePublishPlaceMessageTopic(node, pid, me, dispatch);

    handleJoinPlaceProtocol(node, place, messages);

    dispatch(push(`/places/${pid}`));
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
    const state = thunkAPI.getState();

    const node = ipfsNode();
    const file = await node.add({
      path: avatarImage.name,
      content: avatarImage,
    });

    let swarmKey;
    if (isPrivate) {
      // TODO private swarm
      // const swarmKey = uuidv4()
      // p2pNodes.privateIpfsNodes[id] = await IPFS.create({})
    }

    const pid = uuidv4();

    // build a invitation url
    const invitationUrl = await buildInvitationUrl(ipfsNode(), pid);

    const cid = file.cid.toBaseEncodedString();

    const timestamp = getUnixTime(new Date());
    const dataUrl = await readAsDataURL(avatarImage);

    const place: Place = {
      id: pid,
      name,
      description,
      avatarImage: dataUrl,
      avatarImageCID: cid,
      timestamp: timestamp,
      createdAt: timestamp,
      messageIds: [],
      unreadMessages: [],
      swarmKey: swarmKey || undefined,
      invitationUrl: invitationUrl.href,
    };

    const messages: Message[] = [];
    dispatch(placeAdded({ place, messages }));

    dispatch(
      ipfsContentAdded({
        cid,
        dataUrl,
        file: avatarImage,
      })
    );

    handleJoinPlaceProtocol(node, place, messages);
    subscribePublishPlaceMessageTopic(node, pid, state.me, dispatch);

    dispatch(push(`/places/${pid}`));
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

const getIpfsContentFile = async (cid: string) => {
  for await (const entry of ipfsNode().get(cid)) {
    if (entry.type === 'dir' || !entry.content) continue;
    const blob = new Blob([uint8ArrayConcat(await all(entry.content!))], {
      type: 'application/octet-binary',
    });
    const file = new File([blob], entry.path);
    return file;
  }
};

const addIpfsContent = async (dispatch: AppDispatch, cid: string) => {
  const file = await getIpfsContentFile(cid);
  if (!file) return;

  const dataUrl = await readAsDataURL(file);
  dispatch(
    ipfsContentAdded({
      cid,
      dataUrl,
      file,
    })
  );
  return dataUrl;
};

const handleJoinPlaceProtocol = (
  node: Ipfs,
  place: Place,
  messages: Message[]
) => {
  // @ts-ignore
  node.libp2p.handle(
    joinPlaceProtocol(place.id),
    // @ts-ignore
    ({ stream, connection }) => {
      // TODO(kyfk): validate a peer id is the same being invited.
      // const peerId = connection.remotePeer.toB58String();

      const { invitationUrl, avatarImage, ...omittedPlace } = place;

      pipe(
        [
          JSON.stringify({
            messages: messages.map((m) => {
              const { contentUrl, ...messageOmitted } = m;
              return messageOmitted;
            }),
            place: omittedPlace,
          }),
        ],
        stream
      );
    }
  );
};

const buildInvitationUrl = async (node: Ipfs, pid: string) => {
  const nid = await node.id();
  const invitationUrl = new URL(`https://localhost:3000`);
  invitationUrl.searchParams.append('pid', pid);
  nid.addresses.map((addr) => {
    invitationUrl.searchParams.append('addrs', addr.toString());
  });
  invitationUrl.searchParams.append('pubKey', nid.publicKey);
  return invitationUrl;
};

export const unsubscribeIpfsNode = createAsyncThunk<
  void,
  { pid: string },
  { dispatch: AppDispatch; state: RootState }
>('p2p/initNodes', async ({ pid }) => {
  ipfsNode().pubsub.unsubscribe(publishPlaceMessageTopic(pid));
  // @ts-ignore
  ipfsNode().libp2p.unhandle(joinPlaceProtocol(pid));
});
