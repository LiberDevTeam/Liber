import React from 'react';
import { Textarea } from './textarea';
import { Story } from '@storybook/react/types-6-0';

export default {
  component: Textarea,
  title: 'Textarea',
};

const Template: Story = (args) => <Textarea {...args} />;
export const Default = Template.bind({});
Default.args = {
  placeholder: 'Description',
};
