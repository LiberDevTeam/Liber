import KeyValueStore from 'orbit-db-kvstore';
import { Place } from '~/state/places/type';
import { getOrbitDB } from '../orbit';

let placeDB: KeyValueStore<Place>;

export const readExplorePlaceFromDB = (kv: KeyValueStore<Place>): Place[] => {
  return kv.all;
};

export const connectExplorePlaceKeyValue = async (): Promise<
  KeyValueStore<Place>
> => {
  if (placeDB) {
    return placeDB;
  }

  const orbitDB = await getOrbitDB();
  placeDB = await orbitDB.keyvalue<Place>(
    process.env.EXPLORE_PLACE_DB_ADDRESS || '',
    { accessController: { type: 'record-based' } }
  );
  await placeDB.load();
  return placeDB;

  // return new Promise<KeyValueStore<PlaceDBValue>>((resolve) => {
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
