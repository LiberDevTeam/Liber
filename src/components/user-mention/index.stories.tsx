import { Story } from '@storybook/react/types-6-0';
import React from 'react';
import { Mention } from '~/state/places/messagesSlice';
import { UserMention } from './';

export default {
  component: UserMention,
  title: 'molecules/UserMention',
};

const Template: Story<Mention> = (args) => <UserMention {...args} />;
export const Default = Template.bind({});
