import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Pagination } from '~/components/pagination';
import {
  fetchRanking,
  selectRankingStickersByPage,
} from '~/state/marketplace/stickersSlice';
import { StickerItem } from '../sticker-item';

const Root = styled.div`
  margin: ${(props) => props.theme.space[3]}px 0;
`;

const List = styled.ul``;

const ListItem = styled.li`
  width: 100%;
  padding: ${(props) => `${props.theme.space[6]}px ${props.theme.space[5]}px`};
  border-stickertom: ${(props) =>
    props.theme.border.bold(props.theme.colors.gray3)};
`;

export const StickerRanking: React.FC = memo(function StickerRanking() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const stickers = useSelector(selectRankingStickersByPage(page));

  useEffect(() => {
    if (!stickers.length) {
      dispatch(fetchRanking({ page }));
    }
  }, [page]);

  const handleChangePage = useCallback(
    (page) => {
      setPage(page);
    },
    [page]
  );

  return (
    <Root>
      <List>
        {stickers &&
          stickers.map(
            (sticker) =>
              sticker && (
                <ListItem>
                  <StickerItem sticker={sticker} />
                </ListItem>
              )
          )}
      </List>
      <Pagination current={page} onChange={handleChangePage} />
    </Root>
  );
});
