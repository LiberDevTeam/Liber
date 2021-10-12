import KeyValueStore from 'orbit-db-kvstore';
import { User } from '~/state/users/type';
import { getOrbitDB } from './orbit';

const userDB: Record<string, KeyValueStore<User>> = {};

export const createUserDB = async (): Promise<KeyValueStore<User>> => {
  const orbitDB = await getOrbitDB();

  const db = await orbitDB.keyvalue<User>('user');
  userDB[db.address.root] = db;
  await db.load();
  return db;
};

export const connectUserDB = async ({
  userId,
}: {
  userId: string;
}): Promise<KeyValueStore<User>> => {
  const orbitDB = await getOrbitDB();

  const db = await orbitDB.keyvalue<User>(`/orbitdb/${userId}/user`);
  userDB[userId] = db;
  await db.load();
  return db;

  // return new Promise<KeyValueStore<UserDBValue>>((resolve) => {
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
