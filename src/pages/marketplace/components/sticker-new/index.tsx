import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Pagination } from '~/components/pagination';
import {
  fetchNew,
  selectNewStickersByPage,
} from '~/state/marketplace/stickersSlice';
import { ListItem } from '../list-item';
import { StickerItem } from '../sticker-item';

const Root = styled.div`
  margin: ${(props) => props.theme.space[3]}px 0;
`;

export const StickerNew: React.FC = memo(function StickerNew() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const stickers = useSelector(selectNewStickersByPage(page));

  useEffect(() => {
    if (!stickers.length) {
      dispatch(fetchNew({ page }));
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
            (sticker) =>
              sticker && (
                <ListItem>
                  <StickerItem sticker={sticker} />
                </ListItem>
              )
          )}
      </ul>
      <Pagination current={page} onChange={handleChangePage} />
    </Root>
  );
});
