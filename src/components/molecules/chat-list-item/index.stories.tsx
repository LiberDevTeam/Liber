import React from 'react';
import { ChatItem, ChatListItem, ChatListItemProps } from '.';
import { Story } from '@storybook/react/types-6-0';
import { getUnixTime } from 'date-fns';

// TODO: 実際のchatデータモックに置き換える
const id = '1';
const chat: ChatItem = {
  id,
  title: 'We Love FC Barcelona!!',
  avatarImage: `https://i.pravatar.cc/60?u=${id}`,
  description:
    'this is the last message someone saidasdjfl;askjd;flkajsd;flkjasd;lkfj;dlskaj',
  timestamp: getUnixTime(new Date()),
};

export default {
  component: ChatListItem,
  title: 'molecules/ChatListItem',
  args: {
    chat,
  },
};

const Template: Story<ChatListItemProps> = (args) => <ChatListItem {...args} />;
export const Default = Template.bind({});
