import { Story } from '@storybook/react/types-6-0';
import { UserMenu, UserMenuProps } from './';

export default {
  component: UserMenu,
  title: 'molecules/UserMenu',
};

const Template: Story<UserMenuProps> = (args) => <UserMenu {...args} />;
export const Default = Template.bind({});
