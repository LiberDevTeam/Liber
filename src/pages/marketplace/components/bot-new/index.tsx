import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Pagination } from '~/components/pagination';
import { selectBotsByIds } from '~/state/bots/botsSlice';
import { fetchNew, selectNewIdsByPage } from '~/state/marketplace/botsSlice';
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

export const BotNew: React.FC = memo(function BotNew() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const ids = useSelector(selectNewIdsByPage(page));
  const bots = useSelector(selectBotsByIds(ids));

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
