import type FeedStore from 'orbit-db-feedstore';

export function addDBEventHandler(
  db: FeedStore<unknown>,
  handler: () => void
): void {
  db.events.on('ready', handler);
  db.events.on('replicated', handler);
  db.events.on('write', handler);
  db.events.on('replicate.progress', handler);
}

export function readAllFeedItems<T>(feed: FeedStore<T>): T[] {
  const items = feed.iterator({ limit: -1 }).collect();
  return items.map((item) => item.payload.value);
}
