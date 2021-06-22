import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';
import { Pagination } from '~/components/pagination';
import { SvgEdit as EditIcon } from '~/icons/Edit';
import { selectBotsByIds } from '~/state/bots/botsSlice';

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

const StyledLink = styled(Link)`
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

interface BotListTabPanelProps {
  botIds: string[];
  offset: number;
  limit: number;
  page: number;
  onChangePage: (page: number) => void;
}

export const BotListTabPanel: React.FC<BotListTabPanelProps> = React.memo(
  function BotListTabPanel({ botIds, offset, limit, page, onChangePage }) {
    const bots = useSelector(selectBotsByIds(botIds));
    return (
      <Root>
        <List>
          {bots.slice(offset, offset + limit).map(
            (bot) =>
              bot && (
                <ListItem key={bot.id}>
                  <StyledLink to={`/bots/${bot.keyValAddress}/${bot.id}`}>
                    <LeftGroup>
                      <Avatar cid={bot.avatar} />
                      {bot.name}
                    </LeftGroup>
                    <EditIcon width="24" height="24" />
                  </StyledLink>
                </ListItem>
              )
          )}
        </List>
        <StyledPagination current={page} onChange={onChangePage} />
      </Root>
    );
  }
);
