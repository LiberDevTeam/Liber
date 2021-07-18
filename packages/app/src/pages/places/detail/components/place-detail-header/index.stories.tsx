import { Story } from '@storybook/react/types-6-0';
import React from 'react';
import { PlaceDetailHeader, PlaceDetailHeaderProps } from '.';

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
  placeId: '1234',
  name: 'College Friends',
  avatarCid: 'QmX76A5Ey2H7XDHfSkfNkz3pcDns2tDqV3wpWMzM1c7Mhx',
  memberCount: 23,
};
