import { Story } from '@storybook/react/types-6-0';
import React from 'react';
import { TextLink, TextLinkProps } from '.';

export default {
  component: TextLink,
  title: 'atoms/TextLink',
};

const Template: Story<TextLinkProps> = (args) => <TextLink {...args} />;
export const Default = Template.bind({});
Default.args = {
  to: '/',
  children: 'Link',
};
