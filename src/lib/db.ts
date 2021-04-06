import { Mutex } from 'async-mutex';
import OrbitDB from 'orbit-db';
import FeedStore from 'orbit-db-feedstore';
import KeyValueStore from 'orbit-db-kvstore';
import { Message } from '../state/ducks/places/messagesSlice';
import { PlacePermissions } from '../state/ducks/places/placesSlice';
import { getIpfsNode } from './ipfs';

type MessageFeed = FeedStore<Message>;
type PlaceDBValue = string | number | string[] | boolean | PlacePermissions;

const messageFeeds: Record<string, MessageFeed> = {};
const placeKeyValues: Record<string, KeyValueStore<PlaceDBValue>> = {};

let orbitDB: OrbitDB | null;

const orbitDBMutex = new Mutex();

const dbOptions: IStoreOptions = { accessController: { write: ['*'] } };

export const getOrbitDB = async (): Promise<OrbitDB> => {
  return await orbitDBMutex.runExclusive<OrbitDB>(async () => {
    if (!orbitDB) {
      orbitDB = await OrbitDB.createInstance(await getIpfsNode());
    }
    return orbitDB;
  });
};

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

// Collect messages exclude already read messages
const lastHash: Record<string, string> = {};
export const readMessagesFromFeed = (feed: MessageFeed): Message[] => {
  const items = feed
    .iterator({ limit: -1, gt: lastHash[feed.address.root] ?? undefined })
    .collect();
  if (items.length > 0) {
    lastHash[feed.address.root] = items[items.length - 1].hash;
  }
  return items.map((item) => item.payload.value);
};

export const createMessageFeed = async ({
  placeId,
  hash,
  onMessageAdd,
}: {
  placeId: string;
  hash?: string;
  onMessageAdd: (messages: Message[]) => void;
}): Promise<FeedStore<Message>> => {
  const dbAddress = `${placeId}${hash ? `-${hash}` : ''}/messages`;
  const db = await (await getOrbitDB()).feed<Message>(dbAddress, dbOptions);
  messageFeeds[placeId] = db;
  db.events.on('replicated', () => {
    onMessageAdd(readMessagesFromFeed(db));
  });
  await db.load();
  return db;
};

export const connectMessageFeed = async ({
  placeId,
  address,
  hash,
  onMessageAdd,
}: {
  placeId: string;
  address: string;
  hash?: string;
  onMessageAdd: (messages: Message[]) => void;
}): Promise<FeedStore<Message>> => {
  const dbAddress = getMessagesAddress({ address, placeId, hash });
  const db = await (await getOrbitDB()).feed<Message>(dbAddress);

  db.events.on('replicated', () => {
    onMessageAdd(readMessagesFromFeed(db));
  });
  messageFeeds[placeId] = db;
  return new Promise<FeedStore<Message>>((resolve) => {
    db.events.on('replicate.progress', (_0, _1, _2, progress, have) => {
      if (progress === have) {
        resolve(db);
      }
    });
    db.load();
  });
};

export const createPlaceKeyValue = async (
  placeId: string
): Promise<KeyValueStore<PlaceDBValue>> => {
  const orbitDB = await getOrbitDB();
  const db = await orbitDB.keyvalue<PlaceDBValue>(
    `${placeId}/place`,
    dbOptions
  );
  placeKeyValues[placeId] = db;
  await db.load();
  return db;
};

export const connectPlaceKeyValue = async ({
  placeId,
  address,
}: {
  placeId: string;
  address: string;
}): Promise<KeyValueStore<PlaceDBValue>> => {
  const orbitDB = await getOrbitDB();

  const db = await orbitDB.keyvalue<PlaceDBValue>(
    getPlaceAddress(address, placeId)
  );
  placeKeyValues[placeId] = db;
  return new Promise<KeyValueStore<PlaceDBValue>>((resolve) => {
    db.events.on('replicate.progress', (_0, _1, _2, progress, have) => {
      if (progress === have) {
        resolve(db);
      }
    });
    db.load();
  });
};

export const getMessageFeedById = (
  placeId: string
): MessageFeed | undefined => {
  return messageFeeds[placeId];
};
