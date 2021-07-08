import KeyValueStore from 'orbit-db-kvstore';
import { Sticker } from '~/state/stickers/types';
import { getOrbitDB } from '../../orbit';

let stickerDB: KeyValueStore<Sticker>;

export const readMarketplaceStickerRankingFromDB = (
  kv: KeyValueStore<Sticker>
): Sticker[] => {
  return kv.all;
};

export const connectMarketplaceStickerRankingKeyValue = async (): Promise<
  KeyValueStore<Sticker>
> => {
  if (stickerDB) {
    return stickerDB;
  }

  const orbitDB = await getOrbitDB();
  stickerDB = await orbitDB.keyvalue<Sticker>(
    '/orbitdb/zdpuApFsqGRAmWvt94t4zbzzohBctSTAnJCAVE6qmaw1gKuN8/marketplace/stickers/ranking'
  );
  await stickerDB.load();
  return stickerDB;

  // return new Promise<KeyValueStore<StickerDBValue>>((resolve) => {
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
