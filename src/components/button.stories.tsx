import React from 'react';
import { Button, ButtonProps } from './button';
import { Story } from '@storybook/react/types-6-0';

export default {
  component: Button,
  title: 'Button',
  argTypes: {
    text: { control: 'text', defaultValue: 'Liber' },
    shape: {
      control: {
        type: 'select',
        options: ['square', 'rounded'],
      },
    },
    variant: {
      control: {
        type: 'select',
        options: ['solid', 'outline'],
      },
    },
  },
};

const Template: Story<ButtonProps> = (args) => <Button {...args} />;
export const Default = Template.bind({});
Default.args = { text: 'hello', shape: 'square', variant: 'solid' };

export const All: Story = (args) => (
  <>
    <Button shape="rounded" variant="outline" text={args.text} />
    <Button shape="rounded" variant="solid" text={args.text} />
    <Button shape="square" variant="outline" text={args.text} />
    <Button shape="square" variant="solid" text={args.text} />
  </>
);
