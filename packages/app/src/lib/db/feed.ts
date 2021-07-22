import { Mutex } from 'async-mutex';
import FeedStore from 'orbit-db-feedstore';
import { FeedItem } from '~/state/feed/feedSlice';
import { getOrbitDB } from './orbit';

let feedDB: FeedStore<FeedItem>;

const mutex = new Mutex();

export const readFeedFromDB = (feed: FeedStore<FeedItem>): FeedItem[] => {
  return feed.all;
};

export const connectFeedDB = async (): Promise<FeedStore<FeedItem>> => {
  return await mutex.runExclusive<FeedStore<FeedItem>>(async () => {
    if (feedDB) {
      return feedDB;
    }

    const orbitDB = await getOrbitDB();
    feedDB = await orbitDB.feed<FeedItem>(
      '/orbitdb/zdpuB2yFYHfDXGkLuoGTpzSidwvJ8LSGc4MxDGzVm6bFqmezt/feeds'
    );
    await feedDB.load();
    return feedDB;

    // return new Promise<FeedStore<MessageDBValue>>((resolve) => {
    //   db.events.on('ready', () => {
    //     console.log('ready!!!!!!!!!!!!!!');
    //     console.log(db.get('data'));
    //   });
    //   db.events.on('replicate.progress', (_0, _1, _2, progress, have) => {
    //     if (progress === have) {
    //       resolve(db);
    //     }
    //   });
    //   db.load();
    // });
  });
};
