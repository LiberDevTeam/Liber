import React, { FC, memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';
import { Pagination } from '~/components/pagination';
import { ToggleSwitch } from '~/components/toggle-switch';
import { useAppSelector } from '~/hooks';
import { selectBotsByIds } from '~/state/bots/botsSlice';
import { selectPurchasedBots } from '~/state/me/meSlice';
import { selectPlaceById, toggleBot } from '~/state/places/placesSlice';

const Root = styled.div`
  padding-bottom: ${(props) => props.theme.space[6]}px;
`;

const List = styled.ul`
  margin-top: ${(props) => props.theme.space[6]}px;
`;

const ListItem = styled.li`
  width: 100%;
  height: 72px;
  padding: 0 ${(props) => props.theme.space[5]}px;
  border-bottom: ${(props) =>
    props.theme.border.bold(props.theme.colors.gray3)};
  margin-bottom: ${(props) => props.theme.space[4]}px;
`;

const StyledLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${(props) => props.theme.colors.primaryText};
  font-weight: ${(props) => props.theme.fontWeights.medium};
`;

const LeftGroup = styled.span`
  display: flex;
  align-items: center;
`;

const Avatar = styled(IpfsContent)`
  border-radius: ${(props) => props.theme.radii.round};
  width: 54px;
  height: 54px;
  margin-right: ${(props) => props.theme.space[4]}px;
`;

const StyledPagination = styled(Pagination)`
  padding-bottom: ${(props) => props.theme.space[4]}px;
`;

const BOTS_PER_PAGE = 20;

export interface ManageBotsProps {
  placeId: string;
}

export const ManageBots: FC<ManageBotsProps> = memo(function ManageBots({
  placeId,
}) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const purchasedBots = useAppSelector(selectPurchasedBots);
  const placeBots = useAppSelector(selectPlaceById(placeId))?.bots || [];
  const bots = useAppSelector(
    selectBotsByIds(purchasedBots.map((bot) => bot.botId))
  );

  const handleChange = (botId: string, value: boolean) => {
    dispatch(toggleBot({ placeId, botId, value }));
  };

  return (
    <Root>
      <List>
        {bots
          .slice((page - 1) * BOTS_PER_PAGE, page * BOTS_PER_PAGE)
          .map((bot) => {
            const isEnabled = placeBots.includes(bot.id);

            return (
              <ListItem key={bot.id}>
                <StyledLink>
                  <LeftGroup>
                    <Avatar cid={bot.avatar} />
                    {bot.name}
                  </LeftGroup>
                  <ToggleSwitch
                    checked={isEnabled}
                    onChange={(value) => handleChange(bot.id, value)}
                  />
                </StyledLink>
              </ListItem>
            );
          })}
      </List>
      <StyledPagination current={page} onChange={setPage} />
    </Root>
  );
});
