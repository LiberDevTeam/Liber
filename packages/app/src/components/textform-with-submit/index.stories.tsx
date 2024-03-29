import { Story } from '@storybook/react/types-6-0';
import React from 'react';
import { TextFormWithSubmit, TextFormWithSubmitProps } from '.';

export default {
  component: TextFormWithSubmit,
  title: 'molecules/TextFormWithSubmit',
};

const Template: Story<TextFormWithSubmitProps> = (args) => (
  <TextFormWithSubmit {...args} />
);

export const Default = Template.bind({});
Default.args = {};
