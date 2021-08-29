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

export interface Reaction {
  userIds: string[];
  // emoji-mart/EmojiData's id
  emojiId: string;
}

export interface ReactionMap {
  [messageId: string]: Reaction[];
}

export interface Place extends PartialForUpdate {
  id: string;
  signature?: string;
  createdAt: number;
  timestamp: number; // the timestamp any user in the place acted at
  messageIds: string[];
  unreadMessages: string[];
  hash: string | null;
  permissions: PlacePermissions;
  // orbit db id
  feedAddress: string;
  keyValAddress: string;
  // user ids
  bannedUsers: string[];
  bots: string[];

  readOnly: boolean;
  swarmKey: string | null;
  passwordRequired: boolean;

  reactions: ReactionMap;
}

export type PlaceField = keyof Place;

export interface Mention {
  userId?: string;
  name: string;
  bot: boolean;
}

export interface StickerItem {
  id: string;
  cid: string;
  address: string;
}

export type MessageContent = Array<string | Mention>;

export interface NormalMessage {
  id: string; // UUID
  uid: string;
  timestamp: number;
  content: MessageContent;
  bot: boolean;
  placeId: string;
  placeAddress: string;

  text?: string;
  authorName?: string;
  sticker?: StickerItem;
  attachmentCidList?: string[];
}

export enum SystemMessageType {
  JOIN,
  OTHER,
}

interface MessageBase {
  id: string; // UUID
  timestamp: number;
  placeId: string;
  placeAddress: string;
}

export type SystemMessage =
  | (MessageBase & { type: SystemMessageType.JOIN; uid: string })
  | (MessageBase & { type: SystemMessageType.OTHER });

export interface NormalMessage extends MessageBase {
  uid: string;
  authorName?: string;
  text?: string;
  attachmentCidList?: string[];
  content: MessageContent;
  bot: boolean;

  sticker?: StickerItem;
}

export type Message = SystemMessage | NormalMessage;
