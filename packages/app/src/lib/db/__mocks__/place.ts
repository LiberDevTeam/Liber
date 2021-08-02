import { Place, PlacePermissions, ReactionMap } from '~/state/places/type';

let mockData: DBData = {};

interface KeyValueStoreMock {
  get(key: string): unknown;
}

interface DBData {
  [key: string]: unknown;
}

export const readPlaceFromDB = (kv: KeyValueStoreMock): Place => {
  return {
    id: kv.get('id') as string,
    name: kv.get('name') as string,
    avatarCid: kv.get('avatarCid') as string,
    description: kv.get('description') as string,
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
    bots: kv.get('bots') as string[],
    reactions: (kv.get('reactions') || {}) as ReactionMap,
  };
};
export const connectPlaceKeyValue = (): KeyValueStoreMock => {
  return {
    get: (key: string) => {
      return mockData[key];
    },
  };
};

export const __setMockData = (data: DBData): void => {
  mockData = data;
};
