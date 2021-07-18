import { PrivateFields } from '~/state/me/type';

export const dummyPrivateFields = (): PrivateFields => ({
  settings: {
    isIsolation: false,
  },
  joinedPlaces: [],
  purchasedBots: [],
  purchasedStickers: [],
});
