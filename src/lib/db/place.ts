import KeyValueStore from 'orbit-db-kvstore';
import { Place, PlacePermissions } from '../../state/ducks/places/type';
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

export const readPlaceFromDB = (kv: KeyValueStore<PlaceDBValue>): Place => {
  return {
    id: kv.get('id') as string,
    name: kv.get('name') as string,
    avatarCid: kv.get('avatarCid') as string,
    description: kv.get('description') as string,
    invitationUrl: kv.get('invitationUrl') as string,
    feedAddress: kv.get('feedAddress') as string,
    keyValAddress: kv.get('keyValAddress') as string,
    createdAt: kv.get('createdAt') as number,
    timestamp: kv.get('timestamp') as number,
    passwordRequired: kv.get('passwordRequired') as boolean,
    category: kv.get('category') as number,
    messageIds: [],
    unreadMessages: [],
    permissions: kv.get('permissions') as PlacePermissions,
    readOnly: kv.get('readOnly') as boolean,
    bannedUsers: kv.get('bannedUsers') as string[],
  };
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

  return new Promise<KeyValueStore<PlaceDBValue>>((resolve) => {
    db.events.on('ready', () => {
      resolve(db);
    });
    db.load();
  });
};
