import React, { memo } from 'react';
import { TabKind } from '../constants';

interface Props {
  tab: TabKind;
}

export const StickerItems: React.FC<Props> = memo(function StickerItems({}) {
  return <>sticker item</>;
});
