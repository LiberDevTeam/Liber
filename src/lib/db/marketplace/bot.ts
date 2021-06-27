import KeyValueStore from 'orbit-db-kvstore';
import { Bot } from '~/state/bots/botsSlice';
import { getOrbitDB } from '../orbit';

let botDB: KeyValueStore<Bot>;

export const readMarketplaceBotFromDB = (kv: KeyValueStore<Bot>): Bot[] => {
  return kv.all;
};

export const connectMarketplaceBotKeyValue = async (): Promise<
  KeyValueStore<Bot>
> => {
  if (botDB) {
    return botDB;
  }

  const orbitDB = await getOrbitDB();
  botDB = await orbitDB.keyvalue<Bot>(
    '/orbitdb/zdpuAtvSgGR5Y1amv3viEUyUr3Zuf6hzJd1KvPQJVeQfcTY5m/marketplace/bots'
  );
  await botDB.load();
  return botDB;

  // return new Promise<KeyValueStore<BotDBValue>>((resolve) => {
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
