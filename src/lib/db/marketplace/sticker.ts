import KeyValueStore from 'orbit-db-kvstore';
import { Sticker } from '~/state/stickers/stickersSlice';
import { getOrbitDB } from '../orbit';

let stickerDB: KeyValueStore<Sticker>;

export const readMarketplaceStickerFromDB = (
  kv: KeyValueStore<Sticker>
): Sticker[] => {
  return kv.all;
};

export const connectMarketplaceStickerKeyValue = async (): Promise<
  KeyValueStore<Sticker>
> => {
  if (stickerDB) {
    return stickerDB;
  }

  const orbitDB = await getOrbitDB();
  stickerDB = await orbitDB.keyvalue<Sticker>(
    '/orbitdb/zdpuAszVyTNEebdF5Q2StXxswo4sMXjuXtL7sCvbCaxXovJy7/marketplace/stickers'
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
