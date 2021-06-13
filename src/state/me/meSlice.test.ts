import { dummyPrivateFields } from '~/mocks/privateFields';
import { dummyUser } from '~/mocks/user';
import { createStore } from '~/test-utils/create-store';
import { DB_KEY, updateProperties } from './meSlice';

jest.mock('~/lib/db/user');
jest.mock('~/lib/db/privateFields');
jest.mock('~/lib/db/orbit');

describe('updateProperties', () => {
  const user = dummyUser('');
  const privateFields = dummyPrivateFields();

  it('should update me state and call set function of db', async () => {
    require('~/lib/db/user').__setMockData({ [DB_KEY]: user });
    require('~/lib/db/privateFields').__setMockData({
      [DB_KEY]: privateFields,
    });

    const store = createStore();

    await store.dispatch(
      updateProperties({
        listBot: 'botId1',
        purchaseBot: 'botId2',
        listSticker: 'stickerId1',
        purchaseSticker: 'stickerId2',
      })
    );

    expect(store.getState().me).toEqual({
      id: '',
      botsListingOn: ['botId1'],
      joinedPlaces: [],
      purchasedBots: ['botId2'],
      purchasedStickers: ['botId2'],
      settings: {
        isIsolation: false,
      },
      stickersListingOn: ['stickerId1'],
    });
  });
});
