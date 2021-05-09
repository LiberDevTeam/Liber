import React from 'react';
import { UserMenu, UserMenuProps } from './';
import { Story } from '@storybook/react/types-6-0';

export default {
  component: UserMenu,
  title: 'molecules/UserMenu',
}

const Template: Story<UserMenuProps> = (args) => <UserMenu {...args} />;
export const Default = Template.bind({});