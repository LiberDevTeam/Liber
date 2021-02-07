import React from 'react';
import { SideNavLink, SideNavLinkProps } from '.';
import { Story } from '@storybook/react/types-6-0';
import { Search as SearchIcon } from '@material-ui/icons';

export default {
  component: SideNavLink,
  title: 'atoms/SideNavLink',
};

const Template: Story<SideNavLinkProps> = (args) => <SideNavLink {...args} />;
export const Default = Template.bind({});
Default.args = {
  to: '/',
  icon: <SearchIcon />,
  children: 'Link',
};
