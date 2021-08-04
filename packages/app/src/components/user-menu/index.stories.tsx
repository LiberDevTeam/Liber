import { Story } from '@storybook/react';
import { UserMenu, UserMenuProps } from './';

export default {
  component: UserMenu,
  title: 'molecules/UserMenu',
};

const Template: Story<UserMenuProps> = (args) => <UserMenu {...args} />;
export const Default = Template.bind({});
