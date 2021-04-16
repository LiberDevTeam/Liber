import { Story } from '@storybook/react/types-6-0';
import React from 'react';
import { SettingSection, SettingSectionProps } from '.';

export default {
  component: SettingSection,
  title: 'organisms/SettingSection',
  args: {
    title: 'title',
    description: 'description',
  },
};

const Template: Story<SettingSectionProps> = (args) => (
  <SettingSection {...args} />
);
export const Default = Template.bind({});
