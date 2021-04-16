import { Close as CloseIcon } from '@material-ui/icons';
import { Story } from '@storybook/react/types-6-0';
import React from 'react';
import { IconButton, IconButtonProps } from '.';

export default {
  component: IconButton,
  title: 'atoms/IconButton',
};

const Template: Story<IconButtonProps> = (args) => <IconButton {...args} />;
export const Default = Template.bind({});
Default.args = {
  icon: <CloseIcon />,
};
