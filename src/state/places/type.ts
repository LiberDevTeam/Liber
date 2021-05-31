export enum PlacePermission {
  NONE,
  AUTHOR,
  ADMIN,
  WRITER,
  MODERATOR,
}

// UserId: PlacePermission
export type PlacePermissions = Record<string, PlacePermission>;

export interface PlaceInfo {
  id: string;
  name: string;
  description: string;
  avatarCid: string;
  passwordRequired: boolean;
  readOnly: boolean;
  createdAt: number;
  category: number;
}

export interface Place extends PlaceInfo {
  swarmKey?: string;
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
}
