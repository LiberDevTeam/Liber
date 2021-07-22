import { Mutex } from 'async-mutex';
import KeyValueStore from 'orbit-db-kvstore';
import { Message } from '~/state/places/type';
import { getOrbitDB } from '../orbit';

let messageDB: KeyValueStore<Message>;

const mutex = new Mutex();

export const readExploreMessageFromDB = (
  kv: KeyValueStore<Message>
): Message[] => {
  return kv.all;
};

export const connectExploreMessageKeyValue = async (): Promise<
  KeyValueStore<Message>
> => {
  return await mutex.runExclusive<KeyValueStore<Message>>(async () => {
    if (messageDB) {
      return messageDB;
    }

    const orbitDB = await getOrbitDB();
    messageDB = await orbitDB.keyvalue<Message>(
      '/orbitdb/zdpuAxq5rSrNPWCt7FmfjaGFpgoTXKnCyufDuhhX5WGduYjeN/explore/messages'
    );
    await messageDB.load();
    return messageDB;

    // return new Promise<KeyValueStore<MessageDBValue>>((resolve) => {
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
