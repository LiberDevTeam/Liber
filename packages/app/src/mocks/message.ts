import { getUnixTime } from 'date-fns';
import { faker } from '~/mocks/faker';
import { Message } from '~/state/places/type';

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
  reactions: [],
  ...partialMessage,
});
