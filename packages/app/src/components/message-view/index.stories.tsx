import { Story } from '@storybook/react';
import { Provider } from 'react-redux';
import { dummyMe } from '~/mocks/me';
import { createDummyMessage } from '~/mocks/message';
import { createMockStore } from '~/mocks/store';
import { MessageView } from './';

export default {
  component: MessageView,
  title: 'MessageView',
};

const message = createDummyMessage({
  content: ['Hello, World'],
});

const myMessage = createDummyMessage({
  content: ['Hello, World'],
  uid: dummyMe.id,
});

export const Messages: Story = () => (
  <Provider
    store={createMockStore({
      placeMessages: {
        entities: { [message.id]: message, [myMessage.id]: myMessage },
        ids: [message.id, myMessage.id],
      },
      me: dummyMe,
      users: { ids: [], entities: {}, loading: {} },
    })}
  >
    <MessageView id={message.id} placeId="1" />
    <MessageView id={myMessage.id} placeId="1" />
  </Provider>
);

export const UserMessage: Story = () => (
  <Provider
    store={createMockStore({
      placeMessages: { entities: { [message.id]: message }, ids: [message.id] },
      me: dummyMe,
      users: { ids: [], entities: {}, loading: {} },
    })}
  >
    <MessageView id={message.id} placeId="1" />
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
      users: { ids: [], entities: {}, loading: {} },
    })}
  >
    <MessageView id={myMessage.id} placeId="1" />
  </Provider>
);
