import React from 'react';
import { Story } from '@storybook/react/types-6-0';
import { PlaceListColumn, PlaceListColumnProps } from '.';
import { PlaceItem } from '~/components/molecules/place-list-item';
import { add, getUnixTime, sub } from 'date-fns';

// TODO: 実際のchatデータモックに置き換える
const placeList: PlaceItem[] = [...Array(50)].map((_, index) => {
  const id = String(index);
  const yesterday = sub(new Date(), { days: 1 });
  const time = add(yesterday, { hours: index });
  return {
    id,
    name: 'We Love FC Barcelona!!',
    avatarImage: `https://i.pravatar.cc/60?u=${id}`,
    description:
      'this is the last message someone saidasdjfl;askjd;flkajsd;flkjasd;lkfj;dlskaj',
    timestamp: getUnixTime(time),
    invitationUrl: 'https://liber.live',
  };
});

export default {
  component: PlaceListColumn,
  title: 'organisms/PlaceListColumn',
  args: {
    placeList,
  },
};

const Template: Story<PlaceListColumnProps> = (args) => (
  <PlaceListColumn {...args} />
);
export const Default = Template.bind({});
