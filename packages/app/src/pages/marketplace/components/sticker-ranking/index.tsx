import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Pagination } from '~/components/pagination';
import {
  fetchRanking,
  selectRankingStickersByPage,
} from '~/state/marketplace/stickersSlice';
import { Badge } from '../badge';
import { ListItem } from '../list-item';
import { StickerItem } from '../sticker-item';

const Root = styled.div`
  margin: ${(props) => props.theme.space[3]}px 0;
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
      <ul>
        {stickers &&
          stickers.map(
            (sticker, i) =>
              sticker && (
                <ListItem key={i}>
                  {i < 3 && <Badge n={i + 1} />}
                  <StickerItem sticker={sticker} />
                </ListItem>
              )
          )}
      </ul>
      <Pagination current={page} onChange={handleChangePage} />
    </Root>
  );
});
