import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Pagination } from '~/components/pagination';
import {
  clearSearchResult,
  fetchSearchResult,
  selectSearchResultIdsByPage,
} from '~/state/marketplace/stickersSlice';
import { selectStickersByIds } from '~/state/stickers/stickersSlice';
import { StickerItem } from '../sticker-item';

const Root = styled.div`
  margin: ${(props) => props.theme.space[3]}px 0;
`;

const List = styled.ul``;

const ListItem = styled.li`
  width: 100%;
  padding: ${(props) => `${props.theme.space[6]}px ${props.theme.space[5]}px`};
  border-stickertom: ${(props) => props.theme.border.gray3[2]};
`;

interface Props {
  searchText: string;
}

export const SearchStickerResult: React.FC<Props> = memo(
  function SearchStickerResult({ searchText }) {
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const ids = useSelector(selectSearchResultIdsByPage(page));
    const stickers = useSelector(selectStickersByIds(ids));

    useEffect(() => {
      dispatch(clearSearchResult());
      dispatch(fetchSearchResult({ query: searchText, page }));
      setPage(1);
    }, [searchText]);

    useEffect(() => {
      if (!stickers.length) {
        dispatch(fetchSearchResult({ query: searchText, page }));
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
  }
);
