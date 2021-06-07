import FeedStore from 'orbit-db-feedstore';
import { Message } from '~/state/places/messagesSlice';
import { getOrbitDB } from './orbit';

type MessageFeed = FeedStore<Message>;
const messageFeeds: Record<string, MessageFeed> = {};

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
  const db = await (
    await getOrbitDB()
  ).feed<Message>(dbAddress, {
    accessController: { write: ['*'] },
  });
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
  onMessageAdd?: (messages: Message[]) => void;
}): Promise<FeedStore<Message>> => {
  const dbAddress = getMessagesAddress({ address, placeId, hash });
  const db = await (await getOrbitDB()).feed<Message>(dbAddress);

  if (onMessageAdd) {
    db.events.on('replicated', () => {
      onMessageAdd(readMessagesFromFeed(db));
    });
  }
  messageFeeds[placeId] = db;

  return new Promise<FeedStore<Message>>((resolve) => {
    db.events.on('ready', () => {
      resolve(db);
    });
    db.load();
  });
};

export const getMessageFeedById = (
  placeId: string
): MessageFeed | undefined => {
  return messageFeeds[placeId];
};
