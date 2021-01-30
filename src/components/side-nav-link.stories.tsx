import React from 'react';
import { SideNavLink, SideNavLinkProps } from './side-nav-link';
import { Story } from '@storybook/react/types-6-0';

export default {
  component: SideNavLink,
  title: 'SideNavLink',
};

const Template: Story<SideNavLinkProps> = (args) => <SideNavLink {...args} />;
export const Default = Template.bind({});
