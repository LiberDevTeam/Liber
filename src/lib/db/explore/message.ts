import KeyValueStore from 'orbit-db-kvstore';
import { Message } from '~/state/places/type';
import { getOrbitDB } from '../orbit';

let messageDB: KeyValueStore<Message>;

export const readExploreMessageFromDB = (
  kv: KeyValueStore<Message>
): Message[] => {
  return kv.all;
};

export const connectExploreMessageKeyValue = async (): Promise<
  KeyValueStore<Message>
> => {
  if (messageDB) {
    return messageDB;
  }

  const orbitDB = await getOrbitDB();
  messageDB = await orbitDB.keyvalue<Message>(
    '/orbitdb/zdpuAyatYt9qV41rwVy85VAB3xb66fPXny4uuH7rPYqWrzEgz/explore/messages'
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
};
