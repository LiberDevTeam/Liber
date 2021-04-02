import React from 'react';
import { Story } from '@storybook/react/types-6-0';
import { PlaceListColumn, PlaceListColumnProps } from '.';
import { add, getUnixTime, sub } from 'date-fns';
import { Place } from '~/state/ducks/places/placesSlice';
import { dummyPlace } from '../../../mocks/place';

// TODO: 実際のchatデータモックに置き換える
const placeList: Place[] = [...Array(50)].map((_, index) => {
  const id = String(index);
  const yesterday = sub(new Date(), { days: 1 });
  const time = add(yesterday, { hours: index });
  return { ...dummyPlace(id), timestamp: getUnixTime(time) };
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
Default.args = {};
