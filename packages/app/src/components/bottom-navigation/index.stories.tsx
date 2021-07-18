import { Story } from '@storybook/react/types-6-0';
import React from 'react';
import { BottomNavigation } from '.';

export default {
  component: BottomNavigation,
  title: 'organisms/BottomNavigation',
};

const Template: Story = (args) => <BottomNavigation {...args} />;
export const Default: Story = Template.bind({});
