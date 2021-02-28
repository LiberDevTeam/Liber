import React from 'react';
import { PlaceListColumnItem, PlaceListColumnItemProps } from '.';
import { Story } from '@storybook/react/types-6-0';
import { getUnixTime } from 'date-fns';
import { Place } from '~/state/ducks/places/placesSlice';

// TODO: 実際のchatデータモックに置き換える
const id = '1';
const place: Place = {
  id,
  name: 'We Love FC Barcelona!!',
  avatarImage: `https://i.pravatar.cc/60?u=${id}`,
  description:
    'this is the last message someone saidasdjfl;askjd;flkajsd;flkjasd;lkfj;dlskaj',
  timestamp: getUnixTime(new Date()),
  invitationUrl: 'https://liber.live',
  avatarImageCID: '',
  createdAt: getUnixTime(new Date()),
  messageIds: [],
  unreadMessages: ['unread-message'],
};

export default {
  component: PlaceListColumnItem,
  title: 'molecules/PlaceListColumnItem',
};

const Template: Story<PlaceListColumnItemProps> = (args) => (
  <PlaceListColumnItem {...args} />
);
export const Default = Template.bind({});
Default.args = {
  place,
};
