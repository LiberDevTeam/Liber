import React from 'react';
import { MessageView, MessageViewProps } from '.';
import { Story } from '@storybook/react/types-6-0';
import userImage from '../../../mocks/user.png';

export default {
  component: MessageView,
  title: 'MessageView',
};

const Template: Story<MessageViewProps> = (args) => <MessageView {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'Charlie Malik',
  userImage,
  text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.`,
  timestamp: 1612204980,
  mine: false,
  attachmentCidList: ["cid"],
};
