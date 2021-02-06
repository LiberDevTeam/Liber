import React from 'react';
import { ChatListItem, ChatListItemProps } from '.';
import { Story } from '@storybook/react/types-6-0';

export default {
  component: ChatListItem,
  title: 'molecules/ChatListItem',
};

const Template: Story<ChatListItemProps> = (args) => <ChatListItem {...args} />;
export const Default = Template.bind({});
