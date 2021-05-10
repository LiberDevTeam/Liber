import React, { memo } from 'react';
import { Sticker } from '~/state/ducks/stickers/stickersSlice';

interface Props {
  sticker: Sticker;
}

export const StickerItem: React.FC<Props> = memo(function StickerItem({}) {
  return <>sticker item</>;
});
