import React from 'react';
import styled from 'styled-components';
import { Pagination } from '~/components/pagination';
import { Sticker } from '~/state/ducks/stickers/stickersSlice';
import { StickerListItem } from '../sticker-list-item';

const Root = styled.div`
  padding-bottom: ${(props) => props.theme.space[6]}px;
`;

const StickerList = styled.ul`
  margin-top: ${(props) => props.theme.space[6]}px;
`;

const StyledPagination = styled(Pagination)`
  padding-bottom: ${(props) => props.theme.space[4]}px;
`;

interface StickerListTabPanelProps {
  offset: number;
  limit: number;
  stickers: Sticker[];
  page: number;
  onChangePage: (page: number) => void;
}

export const StickerListTabPanel: React.FC<StickerListTabPanelProps> = React.memo(
  function StickerListTabPanel({
    offset,
    limit,
    stickers,
    page,
    onChangePage,
  }) {
    return (
      <Root>
        <StickerList>
          {stickers.slice(offset, offset + limit).map((sticker) => (
            <StickerListItem key={sticker.id} sticker={sticker} />
          ))}
        </StickerList>
        <StyledPagination current={page} onChange={onChangePage} />
      </Root>
    );
  }
);
