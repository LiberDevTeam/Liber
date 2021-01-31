import React from 'react';
import { ChatListItem, ChatListItemProps } from '.';
import { Story } from '@storybook/react/types-6-0';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';

export default {
  component: ChatListItem,
  title: 'molecules/ChatListItem',
};

const history = createBrowserHistory();

const Template: Story<ChatListItemProps> = (args) => (
  <Router history={history}>
    <ChatListItem {...args} />
  </Router>
);
export const Default = Template.bind({});
