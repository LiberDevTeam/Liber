import { dummyBot } from '~/mocks/bot';
import { dummyPlace } from '~/mocks/place';
import { dummyUser } from '~/mocks/user';
import { createStore } from '~/test-utils/create-store';
import { joinPlace } from './placesSlice';
import { parseText } from './utils';

jest.mock('~/lib/db/place');
jest.mock('~/lib/db/bot');
jest.mock('~/lib/db/orbit');

describe('joinPlace', () => {
  const place = dummyPlace('place-1');

  it('should add place information if place is fully loaded', async () => {
    require('~/lib/db/place').__setMockData(place);
    const store = createStore();
    await store.dispatch(joinPlace({ placeId: 'place', address: 'address' }));

    expect(store.getState().places).toEqual({
      ids: [place.id],
      entities: { [place.id]: place },
    });
  });

  it('should not add place information if place is missing information', async () => {
    const missingInfoPlace = { ...place, id: undefined };
    require('~/lib/db/place').__setMockData(missingInfoPlace);
    const store = createStore();
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
