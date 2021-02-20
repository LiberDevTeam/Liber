import React from 'react';
import { MessageView, MessageViewProps } from '.';
import { Story } from '@storybook/react/types-6-0';

export default {
  component: MessageView,
  title: 'molecules/MessageView',
};

const Template: Story<MessageViewProps> = (args) => <MessageView {...args} />;

export const Default = Template.bind({});
Default.args = {
  authorId: 'C7140B81',
  text: 'それはpornスター。サッカーやない',
  timestamp: 1612204980858,
};
