import React from 'react';
import { Input } from './input';
import { Story } from '@storybook/react/types-6-0';

export default {
  component: Input,
  title: 'Input',
};

const Template: Story = (args) => <Input {...args} />;
export const Default = Template.bind({});
Default.args = {
  placeholder: 'Name',
};
