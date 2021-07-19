import FeedStore from 'orbit-db-feedstore';
import { Message } from '~/state/places/type';
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
export const readMessagesFromFeed = (feed: MessageFeed): Message[] => {
  const items = feed.iterator({ limit: -1 }).collect();
  return items.map((item) => item.payload.value);
};

export const createMessageFeed = async ({
  placeId,
  hash,
  onReceiveEvent,
}: {
  placeId: string;
  hash?: string;
  onReceiveEvent: (messages: Message[]) => void;
}): Promise<FeedStore<Message>> => {
  const dbAddress = `${placeId}${hash ? `-${hash}` : ''}/messages`;
  const db = await (
    await getOrbitDB()
  ).feed<Message>(dbAddress, {
    accessController: { write: ['*'] },
  });
  messageFeeds[placeId] = db;

  const handleEvent = () => onReceiveEvent(readMessagesFromFeed(db));
  db.events.on('ready', handleEvent);
  db.events.on('replicated', handleEvent);
  db.events.on('write', handleEvent);
  db.events.on('replicate.progress', handleEvent);

  await db.load();
  return db;
};

export const connectMessageFeed = async ({
  placeId,
  address,
  hash,
  onReceiveEvent,
}: {
  placeId: string;
  address: string;
  hash?: string;
  onReceiveEvent: (messages: Message[]) => void;
}): Promise<FeedStore<Message>> => {
  if (messageFeeds[placeId]) {
    return messageFeeds[placeId];
  }

  const dbAddress = getMessagesAddress({ address, placeId, hash });
  const db = await (
    await getOrbitDB()
  ).feed<Message>(dbAddress, { overwrite: true });

  const handleEvent = async () => {
    onReceiveEvent(readMessagesFromFeed(db));
  };
  db.events.on('ready', handleEvent);
  db.events.on('replicated', () => handleEvent());
  db.events.on('write', handleEvent);
  db.events.on('replicate.progress', handleEvent);

  messageFeeds[placeId] = db;

  await db.load();
  return db;
};

export const getMessageFeedById = (
  placeId: string
): MessageFeed | undefined => {
  return messageFeeds[placeId];
};
