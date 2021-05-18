import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Pagination } from '~/components/pagination';
import { selectBotsByIds } from '~/state/ducks/bots/botsSlice';
import {
  clearSearchResult,
  fetchSearchResult,
} from '~/state/ducks/marketplace/botsSlice';
import { selectSearchResultIdsByPage } from '~/state/ducks/marketplace/stickersSlice';
import { BotItem } from '../bot-item';

const Root = styled.div`
  margin: ${(props) => props.theme.space[3]}px 0;
`;

const List = styled.ul``;

const ListItem = styled.li`
  width: 100%;
  padding: ${(props) => `${props.theme.space[6]}px ${props.theme.space[5]}px`};
  border-bottom: ${(props) => props.theme.border.grayLight.light};
`;

interface Props {
  searchText: string;
}

export const SearchBotResult: React.FC<Props> = memo(function SearchBotResult({
  searchText,
}) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const ids = useSelector(selectSearchResultIdsByPage(page));
  const bots = useSelector(selectBotsByIds(ids));

  useEffect(() => {
    dispatch(clearSearchResult());
    dispatch(fetchSearchResult({ query: searchText, page }));
    setPage(1);
  }, [searchText]);

  useEffect(() => {
    if (!bots.length) {
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
        {bots &&
          bots.map(
            (bot) =>
              bot && (
                <ListItem>
                  <BotItem bot={bot} />
                </ListItem>
              )
          )}
      </List>
      <Pagination current={page} onChange={handleChangePage} />
    </Root>
  );
});
