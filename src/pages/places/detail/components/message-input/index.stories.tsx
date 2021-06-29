import { Story } from '@storybook/react';
import { MessageInput, MessageInputProps } from '.';

export default {
  component: MessageInput,
  title: 'molecules/PlaceDetailHeader',
  argTypes: {
    onInviteClick: {
      action: 'onInviteClick',
    },
    onLeave: {
      action: 'onLeave',
    },
  },
};

const Template: Story<MessageInputProps> = (args) => <MessageInput {...args} />;

export const Default = Template.bind({});
Default.args = {};
