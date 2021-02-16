import React from 'react';
import { PlaceItem, PlaceListColumnItem, PlaceListColumnItemProps } from '.';
import { Story } from '@storybook/react/types-6-0';
import { getUnixTime } from 'date-fns';

// TODO: 実際のchatデータモックに置き換える
const id = '1';
const place: PlaceItem = {
  id,
  name: 'We Love FC Barcelona!!',
  avatarImage: `https://i.pravatar.cc/60?u=${id}`,
  description:
    'this is the last message someone saidasdjfl;askjd;flkajsd;flkjasd;lkfj;dlskaj',
  timestamp: getUnixTime(new Date()),
};

export default {
  component: PlaceListColumnItem,
  title: 'molecules/PlaceListColumnItem',
  args: {
    place,
  },
};

const Template: Story<PlaceListColumnItemProps> = (args) => (
  <PlaceListColumnItem {...args} />
);
export const Default = Template.bind({});
