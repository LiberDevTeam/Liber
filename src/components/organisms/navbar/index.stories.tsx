import React from 'react';
import Navbar, { NavbarProps } from '.';
import { MemoryRouter } from 'react-router-dom';
import { Story } from '@storybook/react/types-6-0';

export default {
  component: Navbar,
  title: 'Navbar',
};

const Template: Story<NavbarProps> = (args) => (
  <MemoryRouter>
    <Navbar {...args} />
  </MemoryRouter>
);
export const Default = Template.bind({});
