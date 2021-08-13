import type FeedStore from 'orbit-db-feedstore';
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

export const createMessageFeed = async ({
  placeId,
  hash,
}: {
  placeId: string;
  hash?: string;
}): Promise<FeedStore<Message>> => {
  const dbAddress = `${placeId}${hash ? `-${hash}` : ''}/messages`;
  const db = await (await getOrbitDB()).feed<Message>(dbAddress, {
    accessController: { write: ['*'] },
  });
  messageFeeds[placeId] = db;

  await db.load();
  return db;
};

export const connectMessageFeed = async ({
  placeId,
  address,
  hash,
}: {
  placeId: string;
  address: string;
  hash?: string;
}): Promise<FeedStore<Message>> => {
  if (messageFeeds[placeId]) {
    return messageFeeds[placeId];
  }

  const dbAddress = getMessagesAddress({ address, placeId, hash });
  const db = await (await getOrbitDB()).feed<Message>(dbAddress, {
    overwrite: true,
  });

  messageFeeds[placeId] = db;

  await db.load();
  return db;
};

export const getMessageFeedById = (
  placeId: string
): MessageFeed | undefined => {
  return messageFeeds[placeId];
};
