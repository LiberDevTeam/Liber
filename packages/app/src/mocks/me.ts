import { faker } from '~/mocks/faker';
import { Me } from '~/state/me/type';

export const dummyMe: Me = {
  id: faker.datatype.uuid(),
  name: faker.internet.userName(),
  botsListingOn: [],
  joinedPlaces: [],
  privateDBAddress: '',
  purchasedBots: [],
  purchasedStickers: [],
  stickersListingOn: [],
  avatarCid: '',
  settings: {
    isIsolation: false,
  },
};
