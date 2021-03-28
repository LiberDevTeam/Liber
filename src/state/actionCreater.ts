import { createAction } from '@reduxjs/toolkit';
import { Message } from './ducks/places/messagesSlice';
import { Place } from './ducks/places/placesSlice';

export const placeAdded = createAction<{ place: Place; messages: Message[] }>(
  'places/placeAdded'
);
export const placeMessageAdded = createAction<{
  pid: string;
  message: Message;
  mine: boolean;
}>('placeMessages/placeMessageAdded');
export const placeMessagesAdded = createAction<{
  placeId: string;
  messages: Message[];
}>('placeMessages/placeMessagesAdded');
