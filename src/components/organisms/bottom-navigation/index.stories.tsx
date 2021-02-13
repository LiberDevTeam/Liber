import React from 'react';
import { BottomNavigation } from '.';
import { Story } from '@storybook/react/types-6-0';

export default {
  component: BottomNavigation,
  title: 'organisms/BottomNavigation',
};

const Template: Story = (args) => <BottomNavigation {...args} />;
export const Default: Story = Template.bind({});
