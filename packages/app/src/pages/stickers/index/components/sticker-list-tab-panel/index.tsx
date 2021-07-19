import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { NotFound } from '~/components/not-found';
import { Pagination } from '~/components/pagination';
import { selectStickersByIds } from '~/state/stickers/stickersSlice';
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
  stickerIds: string[];
  page: number;
  onChangePage: (page: number) => void;
}

export const StickerListTabPanel: React.FC<StickerListTabPanelProps> =
  React.memo(function StickerListTabPanel({
    offset,
    limit,
    stickerIds,
    page,
    onChangePage,
  }) {
    const stickers = useSelector(selectStickersByIds(stickerIds));

    if (stickers.length === 0) {
      return <NotFound />;
    }

    return (
      <Root>
        <StickerList>
          {stickers
            .slice(offset, offset + limit)
            .map(
              (sticker) =>
                sticker && (
                  <StickerListItem key={sticker.id} sticker={sticker} />
                )
            )}
        </StickerList>
        <StyledPagination current={page} onChange={onChangePage} />
      </Root>
    );
  });
