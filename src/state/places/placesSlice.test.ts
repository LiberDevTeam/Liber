import { dummyPlace } from '~/mocks/place';
import { createStore } from '~/test-utils/create-store';
import { parseText } from './messagesSlice';
import { joinPlace } from './placesSlice';

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
      text: '@bot test',
      bots: [{ id: 'bot', name: 'bot', sourceCode: '' }],
      users: [],
    })
  ).toEqual([{ bot: true, name: 'bot', userId: 'bot' }, ' test']);
  expect(
    parseText({
      text: '@bot',
      bots: [{ id: 'bot', name: 'bot', sourceCode: '' }],
      users: [],
    })
  ).toEqual([{ bot: true, name: 'bot', userId: 'bot' }]);
  expect(
    parseText({
      text: '@user test',
      bots: [],
      users: [{ id: 'user', name: 'user' }],
    })
  ).toEqual([{ bot: false, name: 'user', userId: 'user' }, ' test']);
});
