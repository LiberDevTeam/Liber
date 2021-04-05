import React from 'react';
import { Story } from '@storybook/react/types-6-0';
import { PlaceDetailColumn, PlaceDetailColumnProps } from '.';
import { getUnixTime } from 'date-fns';
import { Message } from '~/state/ducks/places/messagesSlice';
import { Place } from '~/state/ducks/places/placesSlice';
import { dummyPlace } from '../../mocks/place';

// TODO: 実際のchatデータモックに置き換える
const id = '1';
const place: Place = dummyPlace(id);
const message: Message = {
  id,
  authorId: id,
  timestamp: getUnixTime(new Date()),
  text:
    'this is the last message someone saidasdjfl;askjd;flkajsd;flkjasd;lkfj;dlskaj',
};

export default {
  component: PlaceDetailColumn,
  title: 'organisms/PlaceDetailColumn',
  args: {
    place,
    messages: [...new Array(10)].map(() => message),
  },
};

const Template: Story<PlaceDetailColumnProps> = (args) => (
  <PlaceDetailColumn {...args} />
);
export const Default = Template.bind({});
