import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Pagination } from '~/components/pagination';
import {
  clearSearchResult,
  fetchSearchResult,
  selectSearchResultBotsByPage,
} from '~/state/marketplace/botsSlice';
import { BotItem } from '../bot-item';

const Root = styled.div`
  margin: ${(props) => props.theme.space[3]}px 0;
`;

const List = styled.ul``;

const ListItem = styled.li`
  width: 100%;
  padding: ${(props) => `${props.theme.space[6]}px ${props.theme.space[5]}px`};
  border-bottom: ${(props) =>
    props.theme.border.bold(props.theme.colors.gray3)};
`;

interface Props {
  searchText: string;
}

export const SearchBotResult: React.FC<Props> = memo(function SearchBotResult({
  searchText,
}) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const bots = useSelector(selectSearchResultBotsByPage(page));

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
