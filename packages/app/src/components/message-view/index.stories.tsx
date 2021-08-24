import { Story } from '@storybook/react';
import { Provider } from 'react-redux';
import { dummyMe } from '~/mocks/me';
import {
  createDummyMessageForPlace,
  createSystemMessage,
} from '~/mocks/message';
import { dummyPlace } from '~/mocks/place';
import { createMockStore } from '~/mocks/store';
import { MessageView } from './';

export default {
  component: MessageView,
  title: 'MessageView',
};

const place = dummyPlace('place-1');
const places = { entities: { [place.id]: place }, ids: [place.id] };

const message = createDummyMessageForPlace(place, {
  content: ['Hello, World'],
});

const myMessage = createDummyMessageForPlace(place, {
  content: ['Hello, World'],
  uid: dummyMe.id,
});

const systemMessage = createSystemMessage(place, {});

export const Messages: Story = () => (
  <Provider
    store={createMockStore({
      placeMessages: {
        entities: {
          [message.id]: message,
          [systemMessage.id]: systemMessage,
          [myMessage.id]: myMessage,
        },
        ids: [message.id, systemMessage.id, myMessage.id],
      },
      places,
      me: dummyMe,
      users: { ids: [], entities: {}, loading: {} },
    })}
  >
    <MessageView id={systemMessage.id} placeId={place.id} />
    <MessageView id={message.id} placeId={place.id} />
    <MessageView id={myMessage.id} placeId={place.id} />
  </Provider>
);

export const UserMessage: Story = () => (
  <Provider
    store={createMockStore({
      placeMessages: { entities: { [message.id]: message }, ids: [message.id] },
      me: dummyMe,
      places,
      users: { ids: [], entities: {}, loading: {} },
    })}
  >
    <MessageView id={message.id} placeId={place.id} />
  </Provider>
);

export const MyMessage: Story = () => (
  <Provider
    store={createMockStore({
      placeMessages: {
        entities: { [myMessage.id]: myMessage },
        ids: [myMessage.id],
      },
      me: dummyMe,
      places,
      users: { ids: [], entities: {}, loading: {} },
    })}
  >
    <MessageView id={myMessage.id} placeId={place.id} />
  </Provider>
);

export const SystemMessage: Story = () => (
  <Provider
    store={createMockStore({
      placeMessages: {
        entities: { [systemMessage.id]: systemMessage },
        ids: [systemMessage.id],
      },
      me: dummyMe,
      places,
      users: { ids: [], entities: {}, loading: {} },
    })}
  >
    <MessageView id={systemMessage.id} placeId={place.id} />
  </Provider>
);
