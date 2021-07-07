import KeyValueStore from 'orbit-db-kvstore';
import { Bot } from '~/state/bots/types';
import { getOrbitDB } from '../../orbit';

let botDB: KeyValueStore<Bot>;

export const readMarketplaceBotRankingFromDB = (
  kv: KeyValueStore<Bot>
): Bot[] => {
  return kv.all;
};

export const connectMarketplaceBotRankingKeyValue = async (): Promise<
  KeyValueStore<Bot>
> => {
  if (botDB) {
    return botDB;
  }

  const orbitDB = await getOrbitDB();
  botDB = await orbitDB.keyvalue<Bot>(
    '/orbitdb/zdpuAndBaLEbMTpiuK3yWNuiBEhiZ6E6oYCqeuBv1V8CcoEZj/marketplace/bots/ranking'
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
