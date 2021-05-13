import { Story } from '@storybook/react/types-6-0';
import { UserMenu } from './';

export default {
  component: UserMenu,
  title: 'molecules/UserMenu',
};

const Template: Story = (args) => <UserMenu {...args} />;
export const Default = Template.bind({});
