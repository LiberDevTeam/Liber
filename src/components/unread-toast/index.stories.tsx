import { Story } from '@storybook/react/types-6-0';
import React from 'react';
import { UnreadToast, UnreadToastProps } from '.';

export default {
  component: UnreadToast,
  title: 'molecules/UnreadToast',
};

const Template: Story<UnreadToastProps> = (args) => <UnreadToast {...args} />;
export const Default = Template.bind({});
Default.args = {
  messageCount: 1,
};
