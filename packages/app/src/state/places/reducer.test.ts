import { createDummyMessageForPlace } from '~/mocks/message';
import { dummyPlace } from '~/mocks/place';
import { placeMessagesAdded } from '~/state/actionCreator';
import reducers from './placesSlice';
test('placeMessagesAdded', () => {
  const place = dummyPlace('place-1');
  const message = createDummyMessageForPlace(place, {
    text: '',
  });
  expect(
    reducers(
      { entities: { [place.id]: place }, ids: [place.id] },
      placeMessagesAdded({ placeId: place.id, messages: [message] })
    )
  ).toEqual({
    entities: {
      [place.id]: {
        ...place,
        timestamp: message.timestamp,
        messageIds: [message.id],
      },
    },
    ids: [place.id],
  });
});
