import React from 'react';
import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';
import { useAppSelector } from '~/hooks';
import { selectPurchasedStickers } from '~/state/me/meSlice';
import { selectStickersByIds } from '~/state/stickers/stickersSlice';
import { StickerPanelItems } from './stickers';

const Root = styled.div``;

const StickerView = styled(IpfsContent)`
  border-radius: ${(props) => props.theme.radii.large}px;
  width: 64px;
  height: 64px;
  margin-right: ${(props) => props.theme.space[3]}px;
  object-fit: contain;
  cursor: pointer;
`;

interface Props {
  placeId: string;
}

export const StickerPanel: React.FC<Props> = React.memo(function StickerPanel({
  placeId,
}) {
  const stickers = useAppSelector((state) =>
    selectStickersByIds(
      selectPurchasedStickers(state).map((pk) => pk.stickerId)
    )(state)
  );

  return (
    <Root>
      <StickerView cid="Qmf2bo1KLtfzqhrj6Hk8TrMMiQ6pSBi8c83LDdrM6Fxz9V" />
      {stickers.map((sticker) => (
        <StickerPanelItems
          stickerId={sticker.id}
          key={sticker.id}
          placeId={placeId}
        />
      ))}
    </Root>
  );
});
