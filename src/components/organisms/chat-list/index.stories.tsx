import React from 'react';
import { Story } from '@storybook/react/types-6-0';
import { ChatList, ChatListProps } from '.';
import { ChatItem } from '~/components/molecules/chat-list-item';
import { add, getUnixTime, sub } from 'date-fns';

// TODO: 実際のchatデータモックに置き換える
const chatList: ChatItem[] = [...Array(50)].map((_, index) => {
  const id = String(index);
  const yesterday = sub(new Date(), { days: 1 });
  const time = add(yesterday, { hours: index });
  return {
    id,
    title: 'We Love FC Barcelona!!',
    avatarImage: `https://i.pravatar.cc/60?u=${id}`,
    description:
      'this is the last message someone saidasdjfl;askjd;flkajsd;flkjasd;lkfj;dlskaj',
    timestamp: getUnixTime(time),
  };
});

export default {
  component: ChatList,
  title: 'organisms/ChatList',
  args: {
    chatList,
  },
};

const Template: Story<ChatListProps> = (args) => <ChatList {...args} />;
export const Default = Template.bind({});
