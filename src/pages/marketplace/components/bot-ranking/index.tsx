import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Pagination } from '~/components/pagination';
import {
  fetchRanking,
  selectRankingBotsByPage,
} from '~/state/marketplace/botsSlice';
import { Badge } from '../badge';
import { BotItem } from '../bot-item';
import { ListItem } from '../list-item';

const Root = styled.div`
  margin: ${(props) => props.theme.space[3]}px 0;
`;

export const BotRanking: React.FC = memo(function BotRanking() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const bots = useSelector(selectRankingBotsByPage(page));

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
      <ul>
        {bots &&
          bots.map(
            (bot, i) =>
              bot && (
                <ListItem key={i}>
                  {i < 3 && <Badge n={i + 1} />}
                  <BotItem bot={bot} />
                </ListItem>
              )
          )}
      </ul>
      <Pagination current={page} onChange={handleChangePage} />
    </Root>
  );
});
