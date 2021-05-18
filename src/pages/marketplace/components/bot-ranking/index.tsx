import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Pagination } from '~/components/pagination';
import { selectBotsByIds } from '~/state/ducks/bots/botsSlice';
import { fetchRanking } from '~/state/ducks/marketplace/botsSlice';
import { selectRankingIdsByPage } from '~/state/ducks/marketplace/stickersSlice';
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

interface Props {}

export const BotRanking: React.FC<Props> = memo(function BotRanking() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const ids = useSelector(selectRankingIdsByPage(page));
  const bots = useSelector(selectBotsByIds(ids));

  useEffect(() => {
    if (!bots.length) {
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
