import { createAsyncThunk } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import getUnixTime from 'date-fns/getUnixTime';
import IPFS, { IPFS as Ipfs } from 'ipfs';
import all from 'it-all';
import multiaddr from 'multiaddr';
import OrbitDB from 'orbit-db';
import FeedStore from 'orbit-db-feedstore';
import KeyValueStore from 'orbit-db-kvstore';
import { createFromPubKey } from 'peer-id';
import uint8ArrayConcat from 'uint8arrays/concat';
import { publicLibp2pOptions } from '~/lib/libp2p';
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
} from '~/state/ducks/places/placesSlice';
import { AppDispatch, RootState } from '~/state/store';

const publishPlaceMessageTopic = (pid: string) => {
  return `/liber/places/${pid}/messages/publish/1.0.0`;
};

const joinPlaceProtocol = (pid: string) => {
  return `/liber/places/${pid}/join/1.0.0`;
};

type PlaceDBValue = string | number | string[];

const getMessagesAddress = (messagesId: string): string =>
  `/orbitdb/${messagesId}/messages`;
const getPlaceAddress = (placeId: string): string =>
  `/orbitdb/${placeId}/place`;

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

const connectMessageFeed = async ({
  feedId,
  onMessageAdd,
}: {
  feedId?: string;
  onMessageAdd: (messages: Message[]) => void;
}) => {
  if (!orbitDB) {
    throw new Error('orbitDB instance is not exists');
  }

  const db = feedId
    ? await orbitDB.feed<Message>(getMessagesAddress(feedId))
    : await orbitDB.feed<Message>('messages', dbOptions);
  db.events.on('replicated', () => {
    onMessageAdd(readMessagesFromFeed(db));
  });
  messageFeeds[db.address.root] = db;
  await db.load();
  return db;
};

const connectPlaceKeyValue = async (placeId?: string) => {
  if (!orbitDB) {
    throw new Error('orbit DB instance is not exists');
  }

  const db = placeId
    ? await orbitDB.keyvalue<PlaceDBValue>(getPlaceAddress(placeId))
    : await orbitDB.keyvalue<PlaceDBValue>('place', dbOptions);
  db.events.on('replicated', () => {
    console.log('Place info updated');
  });
  placeKeyValues[db.address.root] = db;
  await db.load();
  return db;
};

export const ipfsNode = (): Ipfs => p2pNodes.ipfsNode!;
export const privateIpfsNodes = (pid: string) => p2pNodes.privateIpfsNodes[pid];

export const initNodes = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState }
>('p2p/initNodes', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const dispatch = thunkAPI.dispatch;

  p2pNodes.ipfsNode = await IPFS.create({
    libp2p: publicLibp2pOptions,
  });
  orbitDB = await OrbitDB.createInstance(p2pNodes.ipfsNode);

  selectAllPlaces(state).forEach((place) => {
    connectPlaceKeyValue(place.id);
    connectMessageFeed({
      feedId: place.messagesDBId,
      onMessageAdd: (messages) => {
        dispatch(
          placeMessagesAdded({
            placeId: place.id,
            messages: excludeMyMessages(state.me.id, messages),
          })
        );
      },
    });
  });

  console.log((await p2pNodes.ipfsNode.id()).publicKey);
  console.log((await p2pNodes.ipfsNode.id()).addresses[0].toString());
});

export const publishPlaceMessage = createAsyncThunk<
  void,
  { pid: string; message: Message; file?: File },
  { dispatch: AppDispatch; state: RootState }
>('p2p/publishPlaceMessage', async ({ pid, message, file }, thunkAPI) => {
  const { dispatch } = thunkAPI;
  const state = thunkAPI.getState();
  const msg = { ...message };
  const place = selectPlaceById(pid)(state);

  if (!place) {
    throw new Error(`Place (id: ${pid}) is not exists.`);
  }

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

  if (!messageFeeds[place.messagesDBId]) {
    throw new Error(`messages DB is not exists.`);
  }

  await messageFeeds[place.messagesDBId].add(msg);
  dispatch(placeMessageAdded({ pid, message: msg, mine: true }));
});

export const joinPlace = createAsyncThunk<
  void,
  {
    placeId: string;
    pubKey: string;
    addrs: string[];
  },
  { dispatch: AppDispatch; state: RootState }
>('p2p/joinPlace', async ({ placeId, pubKey, addrs }, thunkAPI) => {
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

  const placeDB = await connectPlaceKeyValue(placeId);
  const name = placeDB.get('id') as string;

  if (!name) {
    throw new Error(`Cannot read data from place DB`);
  }

  const place: Place = {
    id: placeId,
    name: placeDB.get('name') as string,
    avatarImage: placeDB.get('avatarImage') as string,
    avatarImageCID: placeDB.get('avatarImageCID') as string,
    description: placeDB.get('description') as string,
    invitationUrl: placeDB.get('invitationUrl') as string,
    messagesDBId: placeDB.get('messagesDBId') as string,
    createdAt: placeDB.get('createdAt') as number,
    timestamp: placeDB.get('timestamp') as number,
    messageIds: [],
    unreadMessages: [],
  };
  const feed = await connectMessageFeed({
    feedId: place.messagesDBId,
    onMessageAdd: (messages) => {
      dispatch(
        placeMessagesAdded({
          placeId,
          messages: excludeMyMessages(me.id, messages),
        })
      );
    },
  });

  const messages = readMessagesFromFeed(feed);

  dispatch(placeAdded({ place, messages }));
  dispatch(push(`/places/${placeId}`));
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
    const { me } = thunkAPI.getState();

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

    const placeDB = await connectPlaceKeyValue();
    const placeId = placeDB.address.root;
    const messagesDB = await connectMessageFeed({
      onMessageAdd: (messages) => {
        dispatch(
          placeMessagesAdded({
            placeId,
            messages: excludeMyMessages(me.id, messages),
          })
        );
      },
    });

    const cid = file.cid.toBaseEncodedString();
    const timestamp = getUnixTime(new Date());
    const dataUrl = await readAsDataURL(avatarImage);
    // build a invitation url
    const invitationUrl = await buildInvitationUrl(node, placeId);

    const place: Place = {
      id: placeId,
      name,
      description,
      avatarImage: dataUrl,
      avatarImageCID: cid,
      timestamp: timestamp,
      createdAt: timestamp,
      swarmKey: swarmKey || undefined,
      invitationUrl: invitationUrl.href,
      messagesDBId: messagesDB.address.root,
      messageIds: [],
      unreadMessages: [],
    };

    Object.keys(place).forEach((key) => {
      const v = place[key as keyof Place];
      v && placeDB.put(key, v);
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

const buildInvitationUrl = async (node: Ipfs, placeId: string) => {
  const nid = await node.id();
  const invitationUrl = new URL(`https://localhost:3000`);
  invitationUrl.searchParams.append('placeId', placeId);
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
