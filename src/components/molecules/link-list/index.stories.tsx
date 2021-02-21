import React from 'react';
import { LinkList, LinkListProps } from '.';
import { Story } from '@storybook/react/types-6-0';

const linkList = [
  {
    text: 'Privacy Poilcy',
    path: '',
  },
  {
    text: 'Terms of Service',
    path: '',
  },
  {
    text: 'License',
    path: '',
  },
  {
    text: 'Contact Us',
    path: '',
  },
];

export default {
  component: LinkList,
  title: 'molecules/LinkList',
  args: {
    linkList,
  },
};

const Template: Story<LinkListProps> = (args) => <LinkList {...args} />;
export const Default = Template.bind({});
