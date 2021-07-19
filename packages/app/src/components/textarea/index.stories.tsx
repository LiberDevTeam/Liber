import { Story } from '@storybook/react/types-6-0';
import React from 'react';
import { Textarea } from '.';

export default {
  component: Textarea,
  title: 'atoms/Textarea',
};

const Template: Story = (args) => <Textarea {...args} />;
export const Default = Template.bind({});
Default.args = {
  placeholder: 'Description',
};
