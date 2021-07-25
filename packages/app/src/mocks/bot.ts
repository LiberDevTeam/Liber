import { categories } from '~/state/bots/botsSlice';
import { Bot } from '~/state/bots/types';
import { faker } from './faker';

export const dummyBot: Bot = {
  id: faker.datatype.uuid(),
  category: faker.datatype.number(categories.length - 1),
  created: faker.datatype.datetime().getTime(),
  description: faker.lorem.paragraphs(2),
  avatar: faker.image.avatar(),
  examples: [],
  keyValAddress: '',
  name: faker.internet.userName(),
  price: faker.datatype.number(1000),
  sourceCode: `return "hello, world";`,
  readme: faker.lorem.paragraphs(2),
  qtySold: faker.datatype.number(10),
  uid: faker.datatype.uuid(),
};
