import React from 'react';
import { SideNavigation } from '.';
import { Story } from '@storybook/react/types-6-0';

export default {
  component: SideNavigation,
  title: 'organisms/SideNavigation',
};

const Template: Story = (args) => <SideNavigation {...args} />;
export const Default: Story = Template.bind({});