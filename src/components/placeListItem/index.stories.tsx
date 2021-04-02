import React from 'react';
import { PlaceListColumnItem, PlaceListColumnItemProps } from '.';
import { Story } from '@storybook/react/types-6-0';
import { Place } from '~/state/ducks/places/placesSlice';
import { dummyPlace } from '../../mocks/place';

// TODO: 実際のchatデータモックに置き換える
const id = '1';
const place: Place = { ...dummyPlace(id), unreadMessages: ['unread message'] };

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
