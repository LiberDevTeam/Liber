import React from 'react';
import Navbar from '.';
import { MemoryRouter } from 'react-router-dom';

export default {
  component: Navbar,
  title: 'Navbar',
};

const Template = (args) => (
  <MemoryRouter>
    <Navbar {...args} />
  </MemoryRouter>
);
export const Default = Template.bind({});
