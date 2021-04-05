import React from 'react';
import { PlaceDetailHeader, PlaceDetailHeaderProps } from '.';
import { Story } from '@storybook/react/types-6-0';
import avatar from '../../mocks/user.png';

export default {
  component: PlaceDetailHeader,
  title: 'molecules/PlaceDetailHeader',
  argTypes: {
    onInviteClick: {
      action: 'onInviteClick',
    },
    onLeave: {
      action: 'onLeave',
    },
  },
};

const Template: Story<PlaceDetailHeaderProps> = (args) => (
  <PlaceDetailHeader {...args} />
);
export const Default = Template.bind({});
Default.args = {
  name: 'College Friends',
  avatar: avatar,
  memberCount: 23,
};
