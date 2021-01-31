import React from 'react';
import { SideNavLink, SideNavLinkProps } from '.';
import { Story } from '@storybook/react/types-6-0';
import { Search as SearchIcon } from '@material-ui/icons';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

export default {
  component: SideNavLink,
  title: 'atoms/SideNavLink',
};

const history = createBrowserHistory();

const Template: Story<SideNavLinkProps> = (args) => (
  <Router history={history}>
    <SideNavLink {...args} />
  </Router>
);
export const Default = Template.bind({});
Default.args = {
  to: '/',
  icon: <SearchIcon />,
  children: 'Link',
};
