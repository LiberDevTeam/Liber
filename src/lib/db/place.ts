import KeyValueStore from 'orbit-db-kvstore';
import { PlacePermissions } from '../../state/ducks/places/placesSlice';
import { getOrbitDB } from './orbit';

type PlaceDBValue = string | number | string[] | boolean | PlacePermissions;

const placeKeyValues: Record<string, KeyValueStore<PlaceDBValue>> = {};
const getPlaceAddress = (address: string, placeId: string): string =>
  `/orbitdb/${address}/${placeId}/place`;

export const createPlaceKeyValue = async (
  placeId: string
): Promise<KeyValueStore<PlaceDBValue>> => {
  const orbitDB = await getOrbitDB();
  const db = await orbitDB.keyvalue<PlaceDBValue>(`${placeId}/place`, {
    accessController: { write: ['*'] },
  });
  placeKeyValues[placeId] = db;
  await db.load();
  return db;
};

export const connectPlaceKeyValue = async ({
  placeId,
  address,
  waitReplicate = false,
}: {
  placeId: string;
  address: string;
  waitReplicate?: boolean;
}): Promise<KeyValueStore<PlaceDBValue>> => {
  const orbitDB = await getOrbitDB();

  const db = await orbitDB.keyvalue<PlaceDBValue>(
    getPlaceAddress(address, placeId)
  );
  placeKeyValues[placeId] = db;

  return new Promise<KeyValueStore<PlaceDBValue>>((resolve) => {
    if (waitReplicate) {
      db.events.on('replicate.progress', (_0, _1, _2, progress, have) => {
        if (progress === have) {
          resolve(db);
        }
      });
    } else {
      db.events.on('ready', () => {
        resolve(db);
      });
    }
    db.load();
  });
};
