import { createAsyncThunk } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import getUnixTime from 'date-fns/getUnixTime';
import IPFS, { IPFS as Ipfs } from 'ipfs';
import multiaddr from 'multiaddr';
import OrbitDB from 'orbit-db';
import FeedStore from 'orbit-db-feedstore';
import KeyValueStore from 'orbit-db-kvstore';
import { createFromPubKey } from 'peer-id';
import {
  placeAdded,
  placeMessageAdded,
  placeMessagesAdded,
} from '~/state/actionCreater';
import { ipfsContentAdded } from '~/state/ducks/p2p/ipfsContentsSlice';
import { Message } from '~/state/ducks/places/messagesSlice';
import {
  Place,
  selectAllPlaces,
  selectPlaceById,
  setHash,
} from '~/state/ducks/places/placesSlice';
import { AppDispatch, AppThunkDispatch, RootState } from '~/state/store';
import { v4 as uuidv4 } from 'uuid';
import { selectMe } from '../me/meSlice';

const publishPlaceMessageTopic = (pid: string) => {
  return `/liber/places/${pid}/messages/publish/1.0.0`;
};

const joinPlaceProtocol = (pid: string) => {
  return `/liber/places/${pid}/join/1.0.0`;
};

type PlaceDBValue = string | number | string[] | boolean;

async function digestMessage(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

const getMessagesAddress = ({
  address,
  placeId,
  hash,
}: {
  address: string;
  placeId: string;
  hash?: string;
}): string =>
  `/orbitdb/${address}/${placeId}${hash ? `-${hash}` : ''}/messages`;
const getPlaceAddress = (address: string, placeId: string): string =>
  `/orbitdb/${address}/${placeId}/place`;

const dbOptions: IStoreOptions = { accessController: { write: ['*'] } };

const excludeMyMessages = (
  authorId: string,
  messages: Message[]
): Message[] => {
  return messages.filter((m) => m.authorId !== authorId);
};

const p2pNodes: {
  ipfsNode: Ipfs | null;
  privateIpfsNodes: Record<string, Ipfs>;
} = {
  ipfsNode: null,
  privateIpfsNodes: {},
};

let orbitDB: OrbitDB | null;
type MessageFeed = FeedStore<Message>;
const messageFeeds: Record<string, MessageFeed> = {};
const placeKeyValues: Record<string, KeyValueStore<PlaceDBValue>> = {};
const lastHash: Record<string, string> = {};

const readMessagesFromFeed = (feed: MessageFeed): Message[] => {
  const items = feed
    .iterator({ limit: -1, gt: lastHash[feed.address.root] ?? undefined })
    .collect();
  if (items.length > 0) {
    lastHash[feed.address.root] = items[items.length - 1].hash;
  }
  return items.map((item) => item.payload.value);
};

const createMessageReceiveHandler = ({
  dispatch,
  placeId,
  myId,
}: {
  dispatch: AppThunkDispatch;
  placeId: string;
  myId: string;
}) => (messages: Message[]): void => {
  dispatch(
    placeMessagesAdded({
      placeId,
      messages: excludeMyMessages(myId, messages),
    })
  );
};

const connectMessageFeed = async ({
  placeId,
  address,
  hash,
  onMessageAdd,
}: {
  placeId: string;
  address?: string;
  hash?: string;
  onMessageAdd: (messages: Message[]) => void;
}) => {
  if (!orbitDB) {
    throw new Error('orbitDB instance is not exists');
  }

  const dbAddress = address
    ? getMessagesAddress({ address, placeId, hash })
    : `${placeId}${hash ? `-${hash}` : ''}/messages`;

  const db = await orbitDB.feed<Message>(
    dbAddress,
    address ? undefined : dbOptions
  );

  db.events.on('replicated', () => {
    onMessageAdd(readMessagesFromFeed(db));
  });

  messageFeeds[placeId] = db;
  await db.load();
  return db;
};

const connectPlaceKeyValue = async ({
  placeId,
  address,
}: {
  placeId: string;
  address?: string;
}) => {
  if (!orbitDB) {
    throw new Error('orbit DB instance is not exists');
  }

  const db = address
    ? await orbitDB.keyvalue<PlaceDBValue>(getPlaceAddress(address, placeId))
    : await orbitDB.keyvalue<PlaceDBValue>(`${placeId}/place`, dbOptions);
  console.log(db);

  db.events.on('replicated', () => {
    console.log('Place info updated');
  });
  placeKeyValues[placeId] = db;
  await db.load();
  return db;
};

export const ipfsNode = (): Ipfs => p2pNodes.ipfsNode!;
export const privateIpfsNodes = (pid: string): Ipfs =>
  p2pNodes.privateIpfsNodes[pid];

export const initNodes = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState }
>('p2p/initNodes', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const dispatch = thunkAPI.dispatch;

  p2pNodes.ipfsNode = await IPFS.create({
    start: true,
    preload: {
      enabled: true,
    },
    EXPERIMENTAL: { ipnsPubsub: true },
    libp2p: {
      addresses: {
        listen: [
          '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
          '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
          '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/',
        ],
        announce: [],
        noAnnounce: [],
      },
    },
  });
  orbitDB = await OrbitDB.createInstance(p2pNodes.ipfsNode);

  selectAllPlaces(state).forEach(async (place) => {
    connectPlaceKeyValue({ placeId: place.id, address: place.keyValAddress });
    if (place.passwordRequired && place.hash === undefined) {
      return;
    }
    connectMessageFeed({
      placeId: place.id,
      address: place.feedAddress,
      hash: place.hash,
      onMessageAdd: createMessageReceiveHandler({
        dispatch,
        placeId: place.id,
        myId: state.me.id,
      }),
    });
  });
});

export const publishPlaceMessage = createAsyncThunk<
  void,
  { text: string; pid: string; attachments?: File[] },
  { dispatch: AppDispatch; state: RootState }
>(
  'p2p/publishPlaceMessage',
  async ({ pid, text, attachments }, { dispatch, getState }) => {
    const state = getState();
    const place = selectPlaceById(pid)(state);
    const me = selectMe(state);

    if (!place) {
      throw new Error(`Place (id: ${pid}) is not exists.`);
    }

    const message: Message = {
      id: uuidv4(),
      authorName: me.username,
      authorId: me.id,
      text,
      postedAt: getUnixTime(new Date()),
    };

    if (attachments) {
      message.attachments =
        (await Promise.all(
          attachments.map(async (file) => {
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
            return {
              ipfsCid: cid,
              dataUrl: dataUrl,
            };
          })
        )) || [];
    }

    if (!messageFeeds[place.id]) {
      throw new Error(`messages DB is not exists.`);
    }

    await messageFeeds[place.id].add(message);
    dispatch(placeMessageAdded({ pid, message, mine: true }));
  }
);

export const joinPlace = createAsyncThunk<
  void,
  {
    placeId: string;
    pubKey: string;
    address: string;
    addrs: string[];
  },
  { dispatch: AppThunkDispatch; state: RootState }
>('p2p/joinPlace', async ({ placeId, address, pubKey, addrs }, thunkAPI) => {
  const { dispatch } = thunkAPI;
  const { me } = thunkAPI.getState();
  const remotePeer = await createFromPubKey(pubKey);

  const node = ipfsNode();

  // @ts-ignore
  node.libp2p.peerStore.addressBook.add(
    remotePeer,
    addrs.map((addr) => multiaddr(addr))
  );

  if (!orbitDB) {
    throw new Error('OrbitDB is not initialized');
  }

  const placeKeyValue = await connectPlaceKeyValue({ placeId, address });
  const feedAddress = placeKeyValue.get('feedAddress') as string;

  if (!feedAddress) {
    throw new Error(`Cannot read data from place DB`);
  }

  const place: Place = {
    id: placeId,
    name: placeKeyValue.get('name') as string,
    avatarImage: placeKeyValue.get('avatarImage') as string,
    avatarImageCID: placeKeyValue.get('avatarImageCID') as string,
    description: placeKeyValue.get('description') as string,
    invitationUrl: placeKeyValue.get('invitationUrl') as string,
    feedAddress: placeKeyValue.get('feedAddress') as string,
    keyValAddress: placeKeyValue.get('keyValAddress') as string,
    createdAt: placeKeyValue.get('createdAt') as number,
    timestamp: placeKeyValue.get('timestamp') as number,
    passwordRequired: placeKeyValue.get('passwordRequired') as boolean,
    category: placeKeyValue.get('category') as number,
    messageIds: [],
    unreadMessages: [],
  };

  if (place.passwordRequired) {
    dispatch(placeAdded({ place, messages: [] }));
    return;
  }

  const feed = await connectMessageFeed({
    placeId,
    address: feedAddress,
    onMessageAdd: createMessageReceiveHandler({
      dispatch,
      placeId,
      myId: me.id,
    }),
  });

  const messages = readMessagesFromFeed(feed);

  dispatch(placeAdded({ place, messages }));
  dispatch(
    publishPlaceMessage({
      pid: placeId,
      text: `${me.username || me.id} joined!`,
      attachments: [],
    })
  );
  dispatch(push(`/places/${placeId}`));
});

export const openProtectedPlace = createAsyncThunk<
  void,
  { placeId: string; password: string },
  { dispatch: AppThunkDispatch; state: RootState }
>(
  'place/openProtectedPlace',
  async ({ placeId, password }, { dispatch, getState }) => {
    const state = getState();
    const me = state.me;
    const place = selectPlaceById(placeId)(state);

    if (!place) {
      throw new Error(`place: ${placeId} is not found.`);
    }

    const hash = await digestMessage(password);
    const feed = await connectMessageFeed({
      placeId,
      address: place.feedAddress,
      hash,
      onMessageAdd: createMessageReceiveHandler({
        dispatch,
        placeId,
        myId: me.id,
      }),
    });

    const messages = readMessagesFromFeed(feed);
    dispatch(setHash({ placeId, hash }));
    dispatch(placeMessagesAdded({ placeId, messages }));
    dispatch(
      publishPlaceMessage({
        pid: placeId,
        text: `${me.username || me.id} joined!`,
        attachments: [],
      })
    );
  }
);

export const createNewPlace = createAsyncThunk<
  void,
  {
    name: string;
    category: number;
    description: string;
    isPrivate: boolean;
    avatarImage: File;
    password?: string;
  },
  { dispatch: AppDispatch; state: RootState }
>(
  'p2p/createNewPlace',
  async (
    { name, description, isPrivate, avatarImage, password, category },
    { dispatch, getState }
  ) => {
    const { me } = getState();

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

    if (!orbitDB) {
      throw new Error('orbit db is not initialized');
    }

    const placeId = uuidv4();
    const passwordRequired = password !== undefined;
    const placeKeyValue = await connectPlaceKeyValue({ placeId });
    const hash = password ? await digestMessage(password) : undefined;
    const feed = await connectMessageFeed({
      placeId,
      hash,
      onMessageAdd: createMessageReceiveHandler({
        dispatch,
        placeId,
        myId: me.id,
      }),
    });

    const cid = file.cid.toBaseEncodedString();
    const timestamp = getUnixTime(new Date());
    const dataUrl = await readAsDataURL(avatarImage);
    // build a invitation url
    const invitationUrl = await buildInvitationUrl(
      node,
      placeId,
      placeKeyValue.address.root
    );

    const place: Place = {
      id: placeId,
      keyValAddress: placeKeyValue.address.root,
      feedAddress: feed.address.root,
      name,
      description,
      avatarImage: dataUrl,
      avatarImageCID: cid,
      timestamp: timestamp,
      createdAt: timestamp,
      swarmKey: swarmKey || undefined,
      invitationUrl: invitationUrl.href,
      passwordRequired,
      hash,
      category,
      messageIds: [],
      unreadMessages: [],
    };

    Object.keys(place).forEach((key) => {
      if (key === 'hash') return; // Do not add hash to the place db.
      const v = place[key as keyof Place];
      v && placeKeyValue.put(key, v);
    });

    dispatch(placeAdded({ place, messages: [] }));
    dispatch(
      ipfsContentAdded({
        cid,
        dataUrl,
        file: avatarImage,
      })
    );
    dispatch(push(`/places/${placeId}`));
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

const buildInvitationUrl = async (
  node: Ipfs,
  placeId: string,
  address: string
) => {
  const nid = await node.id();
  const invitationUrl = new URL(`https://localhost:3000`);
  invitationUrl.searchParams.append('placeId', placeId);
  invitationUrl.searchParams.append('address', address);
  nid.addresses.forEach((addr) => {
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
