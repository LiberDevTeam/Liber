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
    '/orbitdb/zdpuAosx5ExpwauwNq4TyvUCMPutw9sWfCsWmuBcPwN2hy2rw/marketplace/stickers/ranking',
    { accessController: { type: 'record-based' } }
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
