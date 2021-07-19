import { Story } from '@storybook/react/types-6-0';
import React from 'react';
import { UserAvatar, UserAvatarProps } from './';

export default {
  component: UserAvatar,
  title: 'molecules/UserAvatar',
};

const Template: Story<UserAvatarProps> = (args) => <UserAvatar {...args} />;
export const Default = Template.bind({});
