import { EventEmitter } from 'events';
import { readAllFeedItems } from '~/lib/db/utils';

export function createMockFeed<T>() {
  const events = new EventEmitter();
  const feed: { payload: { value: T } }[] = [];
  return {
    events,
    add: (value: T) => {
      feed.push({ payload: { value } });
      events.emit('write');
    },
    iterator: () => ({ collect: () => feed }),
  };
}

export function createMockKeyValue(values: Record<string, any> = {}) {
  const events = new EventEmitter();
  const kv: Record<string, unknown> = values || {};
  return {
    events,
    all: kv,
    get: (key: string) => kv[key],
    put: (key: string, value: unknown) => {
      kv[key] = value;
      events.emit('write');
    },
  };
}

export function createMockFeedAccessor() {
  const feed = createMockFeed();
  return {
    connect: () => Promise.resolve(feed),
    get: () => feed,
    read: readAllFeedItems,
  };
}

export function createMockKVAccessor(defaultValues: Record<string, any> = {}) {
  const kv = createMockKeyValue(defaultValues);
  return {
    connect: () => Promise.resolve(kv),
    get: () => kv,
    read: () => kv.all,
  };
}
