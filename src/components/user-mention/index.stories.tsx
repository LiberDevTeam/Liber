import { Story } from '@storybook/react/types-6-0';
import React from 'react';
import { UserMention, UserMentionProps } from './';

export default {
  component: UserMention,
  title: 'molecules/UserMention',
};

const Template: Story<UserMentionProps> = (args) => <UserMention {...args} />;
export const Default = Template.bind({});
