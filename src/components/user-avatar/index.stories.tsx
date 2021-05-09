import React from 'react';
import { UserAvatar, UserAvatarProps } from './';
import { Story } from '@storybook/react/types-6-0';

export default {
  component: UserAvatar,
  title: 'molecules/UserAvatar',
}

const Template: Story<UserAvatarProps> = (args) => <UserAvatar {...args} />;
export const Default = Template.bind({});