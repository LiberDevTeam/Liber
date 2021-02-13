import React from 'react';
import { BottomNavLink, BottomNavLinkProps } from '.';
import { Story } from '@storybook/react/types-6-0';
import { Search as SearchIcon } from '@material-ui/icons';

export default {
  component: BottomNavLink,
  title: 'atoms/BottomNavLink',
};

const Template: Story<BottomNavLinkProps> = (args) => (
  <BottomNavLink {...args} />
);
export const Default = Template.bind({});
Default.args = {
  to: '/',
  icon: <SearchIcon />,
  children: 'Link',
};
