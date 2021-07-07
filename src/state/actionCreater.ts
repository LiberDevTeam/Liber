import { createAction } from '@reduxjs/toolkit';
import { Message, Place } from '~/state/places/type';
import { BotPK } from './me/type';

export const placeAdded = createAction<{
  place: Place;
  messages: Message[];
}>('places/placeAdded');
export const placeMessagesAdded = createAction<{
  placeId: string;
  messages: Message[];
}>('placeMessages/placeMessagesAdded');
export const placeUpdated = createAction<Place>('places/updated');

export const botAdded = createAction<BotPK>('bots/added');
