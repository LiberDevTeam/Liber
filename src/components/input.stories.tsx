import React from 'react';
import { Input } from './input';
import { Story } from '@storybook/react/types-6-0';
import { Search as SearchIcon } from '@material-ui/icons';

export default {
  component: Input,
  title: 'ui/Input',
};

const Template: Story = (args) => <Input {...args} />;
export const Default = Template.bind({});
Default.args = {
  placeholder: 'Name',
};

export const Icon = Template.bind({});
Icon.args = {
  icon: <SearchIcon />,
  placeholder: 'Search',
};
