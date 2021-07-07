import React from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';
import { useAppSelector } from '~/hooks';
import { sendSticker } from '~/state/places/messagesSlice';
import { selectStickerById } from '~/state/stickers/stickersSlice';

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
  stickerId: string;
}

export const StickerPanelItems: React.FC<Props> = ({ stickerId, placeId }) => {
  const sticker = useAppSelector(selectStickerById(stickerId), shallowEqual);
  const dispatch = useDispatch();

  if (!sticker) {
    // TODO: show loading
    return <div>loading</div>;
  }

  return (
    <Root>
      {sticker.contents.map((content) => (
        <button
          key={`sticker-panel-${sticker.id}`}
          onClick={() => {
            dispatch(
              sendSticker({
                placeId,
                item: {
                  id: sticker.id,
                  address: sticker.keyValAddress,
                  cid: content.cid,
                },
              })
            );
          }}
        >
          <StickerView
            key={`sticker-panel-${content.cid}`}
            cid={content.cid}
            data-cid={content.cid}
          />
        </button>
      ))}
    </Root>
  );
};
