import type KeyValueStore from 'orbit-db-kvstore';
import type { Place, PlacePermissions, ReactionMap } from '~/state/places/type';
import { getOrbitDB } from './orbit';

type PlaceDBValue =
  | string
  | number
  | string[]
  | boolean
  | PlacePermissions
  | ReactionMap;

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

export const readPlaceFromDB = (kv: KeyValueStore<PlaceDBValue>): Place => {
  return (kv.all as unknown) as Place;
};

export const connectPlaceKeyValue = async ({
  placeId,
  address,
  onReplicated,
}: {
  placeId: string;
  address: string;
  onReplicated?: (db: KeyValueStore<PlaceDBValue>) => void;
}): Promise<KeyValueStore<PlaceDBValue>> => {
  const orbitDB = await getOrbitDB();

  const db = await orbitDB.keyvalue<PlaceDBValue>(
    getPlaceAddress(address, placeId)
  );
  placeKeyValues[placeId] = db;
  if (onReplicated) {
    db.events.on('replicated', () => {
      onReplicated(db);
    });
  }

  await db.load();
  return db;
};

export const getPlaceDB = (
  placeId: string
): KeyValueStore<PlaceDBValue> | undefined => {
  return placeKeyValues[placeId];
};
