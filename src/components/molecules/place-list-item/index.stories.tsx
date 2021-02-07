import React from 'react';
import { PlaceItem, PlaceListItem, PlaceListItemProps } from '.';
import { Story } from '@storybook/react/types-6-0';
import { getUnixTime } from 'date-fns';

// TODO: 実際のchatデータモックに置き換える
const id = '1';
const place: PlaceItem = {
  id,
  title: 'We Love FC Barcelona!!',
  avatarImage: `https://i.pravatar.cc/60?u=${id}`,
  description:
    'this is the last message someone saidasdjfl;askjd;flkajsd;flkjasd;lkfj;dlskaj',
  timestamp: getUnixTime(new Date()),
};

export default {
  component: PlaceListItem,
  title: 'molecules/PlaceListItem',
  args: {
    place,
  },
};

const Template: Story<PlaceListItemProps> = (args) => (
  <PlaceListItem {...args} />
);
export const Default = Template.bind({});
