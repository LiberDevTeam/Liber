import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Pagination } from '~/components/pagination';
import { fetchNew, selectNewBotsByPage } from '~/state/marketplace/botsSlice';
import { BotItem } from '../bot-item';
import { ListItem } from '../list-item';

const Root = styled.div`
  margin: ${(props) => props.theme.space[3]}px 0;
`;

export const BotNew: React.FC = memo(function BotNew() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const bots = useSelector(selectNewBotsByPage(page));

  useEffect(() => {
    if (!bots.length) {
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
        {bots &&
          bots.map(
            (bot) =>
              bot && (
                <ListItem>
                  <BotItem bot={bot} />
                </ListItem>
              )
          )}
      </ul>
      <Pagination current={page} onChange={handleChangePage} />
    </Root>
  );
});
