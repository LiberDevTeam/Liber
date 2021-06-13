import { User } from '../users/type';

export interface Settings {
  isIsolation: boolean;
}

export interface PlacePK {
  placeId: string;
  address: string;
}

export interface PrivateFields {
  settings: Settings;
  joinedPlaces: PlacePK[];
  purchasedBots: string[];
  purchasedStickers: string[];
}

export interface Me extends User, PrivateFields {}
