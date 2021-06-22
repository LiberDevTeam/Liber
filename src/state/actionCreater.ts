import { createAction } from '@reduxjs/toolkit';
import { Message } from '~/state/places/messagesSlice';
import { Place } from '~/state/places/type';
import { BotPK, StickerPK } from './me/type';

export const placeAdded =
  createAction<{
    place: Place;
    messages: Message[];
  }>('places/placeAdded');
export const placeMessagesAdded = createAction<{
  placeId: string;
  messages: Message[];
}>('placeMessages/placeMessagesAdded');
export const placeUpdated = createAction<Place>('places/updated');
export const stickerAdded = createAction<StickerPK>('stickers/added');
export const botAdded = createAction<BotPK>('bots/added');
