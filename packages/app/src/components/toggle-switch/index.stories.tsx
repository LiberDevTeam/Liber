import { Story } from '@storybook/react/types-6-0';
import React from 'react';
import { ToggleSwitch, ToggleSwitchProps } from '.';

export default {
  component: ToggleSwitch,
  title: 'atoms/ToggleSwitch',
  argTypes: {
    checked: {
      control: {
        type: 'boolean',
      },
    },
    width: {
      control: {
        type: 'range',
        min: 1,
        max: 1000,
      },
    },
  },
};

const Template: Story<ToggleSwitchProps> = (args) => <ToggleSwitch {...args} />;
export const Default = Template.bind({});
Default.args = { width: 50 };
