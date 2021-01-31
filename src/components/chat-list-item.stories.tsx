import React from 'react';
import { ChatListItem, ChatListItemProps } from './chat-list-item';
import { Story } from '@storybook/react/types-6-0';

export default {
  component: ChatListItem,
  title: 'chats/ChatListItem',
};

const Template: Story<ChatListItemProps> = (args) => <ChatListItem {...args} />;
export const Default = Template.bind({});
