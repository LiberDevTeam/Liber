import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Pagination } from '~/components/pagination';
import {
  fetchRanking,
  selectBotsByIds,
  selectRankingIdsByPage,
} from '~/state/ducks/marketplace/botsSlice';
import { BotItem } from '../bot-item';

const Root = styled.div``;

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
      {bots && bots.map((bot) => bot && <BotItem bot={bot} />)}
      <Pagination current={page} onChange={handleChangePage} />
    </Root>
  );
});
