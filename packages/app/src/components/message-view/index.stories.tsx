import { Story } from '@storybook/react';
import { Provider } from 'react-redux';
import { dummyMe } from '~/mocks/me';
import { createDummyMessage } from '~/mocks/message';
import { createMockStore } from '~/mocks/store';
import { MessageView } from '.';

export default {
  component: MessageView,
  title: 'MessageView',
};

const message = createDummyMessage({
  content: [
    'hello, worlddaaaaaaaaaaaaaaaaaaaaaaworlddaaaaaaaaaaaaaaaaaaaaaaworlddaaaaaaaaaaaaaaaaaaaaaaworlddaaaaaaaaaaaaaaaaaaaaaa',
  ],
});

export const Default: Story = () => (
  <Provider
    store={createMockStore({
      placeMessages: { entities: { [message.id]: message }, ids: [message.id] },
      me: dummyMe,
      users: { ids: [], entities: {}, loading: {} },
    })}
  >
    <MessageView id={message.id} />
  </Provider>
);
