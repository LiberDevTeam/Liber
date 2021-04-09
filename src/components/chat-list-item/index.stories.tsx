import React from 'react';
import { ChatListItem, ChatListItemProps } from '.';
import { Story } from '@storybook/react/types-6-0';
import { dummyPlace } from '../../mocks/place';
import { Place } from '../../state/ducks/places/placesSlice';

// TODO: 実際のchatデータモックに置き換える
const id = '1';
const place: Place = { ...dummyPlace(id), unreadMessages: ['unread message'] };

export default {
  component: ChatListItem,
  title: 'molecules/PlaceListColumnItem',
};

const Template: Story<ChatListItemProps> = (args) => <ChatListItem {...args} />;
export const Default = Template.bind({});
Default.args = {
  place,
};
