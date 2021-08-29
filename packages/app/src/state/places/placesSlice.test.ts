import { dummyBot } from '~/mocks/bot';
import { dummyPlace } from '~/mocks/place';
import { dummyUser } from '~/mocks/user';
import { joinPlace } from '~/state/places/async-actions';
import { createStore } from '~/test-utils/create-store';
import { parseText } from './utils';

const createMockKeyValue = <T>(item: T) => ({
  get: (key: keyof T) => item[key],
});

describe('joinPlace', () => {
  const place = dummyPlace('place-1');

  it('should add place information if place is fully loaded', async () => {
    const mockDB = createMockKeyValue(place);
    const store = createStore(
      {},
      {
        place: {
          connect: () => mockDB,
          read: () => place,
        },
      }
    );
    await store.dispatch(joinPlace({ placeId: 'place', address: 'address' }));

    expect(store.getState().places).toEqual({
      ids: [place.id],
      entities: { [place.id]: place },
    });
  });

  it('should not add place information if place is missing information', async () => {
    const missingInfoPlace = { ...place, id: undefined };
    const mockDB = createMockKeyValue(missingInfoPlace);
    const store = createStore(
      {},
      {
        place: {
          connect: () => mockDB,
          read: () => missingInfoPlace,
        },
      }
    );
    await store.dispatch(joinPlace({ placeId: 'place', address: 'address' }));

    expect(store.getState().places).toEqual({
      ids: [],
      entities: {},
    });
  });
});

test('parseText', () => {
  expect(parseText({ text: 'test', bots: [], users: [] })).toEqual(['test']);
  expect(
    parseText({
      text: '@hello test @world',
      bots: [],
      users: [],
    })
  ).toEqual(['@hello test @world']);
  expect(
    parseText({
      text: `@${dummyBot.name} test`,
      bots: [dummyBot],
      users: [],
    })
  ).toEqual([{ bot: true, name: dummyBot.name, userId: dummyBot.id }, ' test']);
  expect(
    parseText({
      text: `@${dummyBot.name}`,
      bots: [dummyBot],
      users: [],
    })
  ).toEqual([{ bot: true, name: dummyBot.name, userId: dummyBot.id }]);
  expect(
    parseText({
      text: '@user test',
      bots: [],
      users: [dummyUser('user', 'user')],
    })
  ).toEqual([{ bot: false, name: 'user', userId: 'user' }, ' test']);
});
