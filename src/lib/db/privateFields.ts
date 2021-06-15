import KeyValueStore from 'orbit-db-kvstore';
import { PrivateFields } from '~/state/me/type';
import { getOrbitDB } from './orbit';

const privateFieldsDB: Record<string, KeyValueStore<PrivateFields>> = {};

export const createPrivateFieldsDB = async (): Promise<
  KeyValueStore<PrivateFields>
> => {
  const orbitDB = await getOrbitDB();
  const db = await orbitDB.keyvalue<PrivateFields>(`privateFields`);
  privateFieldsDB[db.address.root] = db;
  await db.load();
  return db;
};

export const connectPrivateFieldsDB = async ({
  address,
}: {
  address: string;
}): Promise<KeyValueStore<PrivateFields>> => {
  const orbitDB = await getOrbitDB();
  const cached = privateFieldsDB[address];
  if (cached) {
    return cached;
  }

  const db = await orbitDB.keyvalue<PrivateFields>(
    `/orbitdb/${address}/privateFields`
  );
  privateFieldsDB[address] = db;
  await db.load();
  return db;

  // return new Promise<KeyValueStore<MeDBValue>>((resolve) => {
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
