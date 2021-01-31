import React from 'react';
import { SideNavigation } from '.';
import { Story } from '@storybook/react/types-6-0';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';

export default {
  component: SideNavigation,
  title: 'organisms/SideNavigation',
};

const history = createBrowserHistory();

const Template: Story = (args) => (
  <Router history={history}>
    <SideNavigation {...args} />
  </Router>
);
export const Default: Story = Template.bind({});
