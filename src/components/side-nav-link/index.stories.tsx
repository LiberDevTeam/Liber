import { Search as SearchIcon } from '@material-ui/icons';
import { Story } from '@storybook/react/types-6-0';
import React from 'react';
import { SideNavLink, SideNavLinkProps } from '.';

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
