import KeyValueStore from 'orbit-db-kvstore';
import { Bot } from '~/state/bots/types';
import { getOrbitDB } from '../../orbit';

let botDB: KeyValueStore<Bot>;

export const readMarketplaceBotNewFromDB = (kv: KeyValueStore<Bot>): Bot[] => {
  return kv.all;
};

export const connectMarketplaceBotNewKeyValue = async (): Promise<
  KeyValueStore<Bot>
> => {
  if (botDB) {
    return botDB;
  }

  const orbitDB = await getOrbitDB();
  botDB = await orbitDB.keyvalue<Bot>(
    '/orbitdb/zdpuAshd1gdvzDag9tZLKgpQpVyFLCr5CX2fd8MjZpSNb7o5m/marketplace/bots/new'
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
