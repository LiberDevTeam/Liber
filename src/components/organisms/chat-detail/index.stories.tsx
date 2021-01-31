import React from 'react';
import { Story } from '@storybook/react/types-6-0';
import { ChatDetail, ChatDetailProps } from '.';

export default {
  component: ChatDetail,
  title: 'organisms/ChatDetail',
};

const Template: Story<ChatDetailProps> = (args) => <ChatDetail {...args} />;
export const Default = Template.bind({});
