import { User } from '../users/type';

export interface Settings {
  isIsolation: boolean;
}

export interface PrivateFields {
  settings: Settings;
  joinedPlaces: string[];
  purchasedBots: string[];
  purchasedStickers: string[];
}

export interface Me extends User, PrivateFields {}
