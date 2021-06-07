export enum PlacePermission {
  NONE,
  AUTHOR,
  ADMIN,
  WRITER,
  MODERATOR,
}

// UserId: PlacePermission
export type PlacePermissions = Record<string, PlacePermission>;

export interface PartialForUpdate {
  name: string;
  description: string;
  avatarCid: string;
  category: number;
}

export interface Place extends PartialForUpdate {
  id: string;
  createdAt: number;
  timestamp: number; // the timestamp any user in the place acted at
  messageIds: string[];
  unreadMessages: string[];
  hash?: string;
  permissions: PlacePermissions;
  // orbit db id
  feedAddress: string;
  keyValAddress: string;
  // user ids
  bannedUsers: string[];

  readOnly: boolean;
  swarmKey?: string;
  passwordRequired: boolean;
}

export type PlaceField = keyof Place;
