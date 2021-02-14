import React from 'react';
import { Story } from '@storybook/react/types-6-0';
import { PlaceDetail, PlaceDetailProps } from '.';
import { PlaceItem } from '~/components/molecules/place-list-item';
import { getUnixTime } from 'date-fns';
import { Message } from '~/state/ducks/place/placeSlice';
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
const message: Message = {
  id,
  type: 'Text',
  uid: id,
  timestamp: getUnixTime(new Date()),
  text:
    'this is the last message someone saidasdjfl;askjd;flkajsd;flkjasd;lkfj;dlskaj',
};

export default {
  component: PlaceDetail,
  title: 'organisms/PlaceDetail',
  args: {
    place,
    messages: [...new Array(10)].map(() => message),
  },
};

const Template: Story<PlaceDetailProps> = (args) => <PlaceDetail {...args} />;
export const Default = Template.bind({});
