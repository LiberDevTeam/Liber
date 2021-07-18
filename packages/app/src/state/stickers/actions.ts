import { createAction } from '@reduxjs/toolkit';
import { StickerPK } from '~/state/me/type';

export const stickerAdded = createAction<StickerPK>('stickers/added');
