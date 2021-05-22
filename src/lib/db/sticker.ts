import KeyValueStore from 'orbit-db-kvstore';
import {
  Category,
  Content,
  Sticker,
} from '../../state/ducks/stickers/stickersSlice';
import { getOrbitDB } from './orbit';

type StickerDBValue = string | Category | number | Content[] | boolean;

const stickerDB: Record<string, KeyValueStore<StickerDBValue>> = {};

export const createStickerKeyValue = async (
  stickerId: string
): Promise<KeyValueStore<StickerDBValue>> => {
  const orbitDB = await getOrbitDB();
  const db = await orbitDB.keyvalue<StickerDBValue>(`${stickerId}/sticker`, {
    accessController: { write: ['*'] },
  });
  stickerDB[db.address.root] = db;
  await db.load();
  return db;
};

export const readStickerFromDB = (
  kv: KeyValueStore<StickerDBValue>
): Sticker => {
  return {
    id: kv.get('id') as string,
    uid: kv.get('uid') as string,
    category: kv.get('category') as Category,
    name: kv.get('name') as string,
    price: kv.get('price') as number,
    description: kv.get('description') as string,
    contents: kv.get('contents') as Content[],
    keyValAddress: kv.get('keyValAddress') as string,
    created: kv.get('created') as number,
  };
};

export const connectStickerKeyValue = async ({
  stickerId,
  address,
}: {
  stickerId: string;
  address: string;
}): Promise<KeyValueStore<StickerDBValue>> => {
  const orbitDB = await getOrbitDB();

  const db = await orbitDB.keyvalue<StickerDBValue>(
    `/orbitdb/${address}/${stickerId}/sticker`
  );
  stickerDB[stickerId] = db;
  await db.load();
  return db;

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
