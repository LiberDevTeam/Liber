import { User } from '../users/type';

export interface Settings {
  isIsolation: boolean;
}

export interface PlacePK {
  placeId: string;
  address: string;
}

export interface BotPK {
  botId: string;
  address: string;
}

export interface StickerPK {
  stickerId: string;
  address: string;
}

export interface PrivateFields {
  settings: Settings;
  joinedPlaces: PlacePK[];
  purchasedBots: BotPK[];
  purchasedStickers: StickerPK[];
}

export interface Me extends User, PrivateFields {
  privateDBAddress: string;
}
