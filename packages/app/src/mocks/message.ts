import { getUnixTime } from 'date-fns';
import { faker } from '~/mocks/faker';
import {
  Message,
  Place,
  SystemMessage,
  SystemMessageType,
} from '~/state/places/type';

export const createDummyMessage = (
  partialMessage: Partial<Message> = {}
): Message => ({
  id: faker.datatype.uuid(),
  bot: false,
  content: [],
  placeAddress: '',
  placeId: '',
  timestamp: getUnixTime(faker.datatype.datetime()),
  uid: faker.datatype.uuid(),
  ...partialMessage,
});

export const createDummyMessageForPlace = (
  place: Place,
  partialMessage: Partial<Message> = {}
): Message => ({
  id: faker.datatype.uuid(),
  bot: false,
  content: [],
  placeAddress: place.feedAddress,
  placeId: place.id,
  timestamp: getUnixTime(faker.datatype.datetime()),
  uid: faker.datatype.uuid(),
  ...partialMessage,
});

export const createSystemMessage = (
  place: Place,
  partialMessage: Partial<SystemMessage> = {}
): SystemMessage => ({
  id: faker.datatype.uuid(),
  placeAddress: place.feedAddress,
  placeId: place.id,
  timestamp: getUnixTime(faker.datatype.datetime()),
  type: SystemMessageType.JOIN,
  uid: faker.datatype.uuid(),
  ...partialMessage,
});
