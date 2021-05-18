import { push } from 'connected-react-router';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '~/components/button';
import { IpfsContent } from '~/components/ipfs-content';
import { TabPanel, TabPanels, Tabs } from '~/components/tabs';
import { useQuery } from '~/lib/queryParams';
import {
  selectBotsListingOn,
  selectPurchasedBots,
} from '~/state/ducks/mypage/botsSlice';
import BaseLayout from '~/templates';
import { Pagination } from '../../components/pagination';
import { SvgEdit as EditIcon } from '../../icons/Edit';

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
  border-bottom: ${(props) => props.theme.border.grayLight.light};
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

const StyledButton = styled(Button)`
  width: 100%;
`;

const StyledButtonLink = styled(Link)`
  margin: 0 ${(props) => props.theme.space[4]}px;
  margin-bottom: ${(props) => props.theme.space[3]}px;
`;

const StyledPagination = styled(Pagination)`
  padding-bottom: ${(props) => props.theme.space[4]}px;
`;

interface Props {}

const TAB_LISTING_ON = 'listing';
const TAB_PURCHASED = 'purchased';
const TAB_LIST = [TAB_LISTING_ON, TAB_PURCHASED];
const TAB_TITLE = {
  [TAB_LISTING_ON]: 'Listing on',
  [TAB_PURCHASED]: 'Purchased',
};

export const BotsPage: React.FC<Props> = React.memo(function BotsPage({}) {
  const { tab } = useQuery<{ tab: string }>();
  const dispatch = useDispatch();

  const handleSelect = useCallback((index: number) => {
    dispatch(push(`/bots?tab=${TAB_LIST[index]}`));
  }, []);

  return (
    <BaseLayout
      title="Bots"
      description="Manage your Bots settings"
      backTo="/profile"
    >
      <StyledButtonLink to="/bots/new">
        <StyledButton shape="rounded" text="SELL YOUR ORIGINAL BOT!" />
      </StyledButtonLink>
      <Tabs
        tabList={TAB_LIST}
        tabTitle={TAB_TITLE}
        selectedTab={tab}
        onSelect={handleSelect}
      >
        <TabPanels>
          <TabPanel hide={tab !== TAB_LISTING_ON}>
            <ListingOn />
          </TabPanel>
          <TabPanel hide={tab !== TAB_PURCHASED}>
            <Purchased />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </BaseLayout>
  );
});

interface PurchacedProps {}

const limit = 10;

const Purchased: React.FC<PurchacedProps> = React.memo(function Purchased() {
  const [page, setPage] = useState(1);
  const bots = useSelector(selectPurchasedBots);

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const offset = (page - 1) * limit;

  return (
    <>
      <List>
        {bots.slice(offset, offset + limit).map((bot) => (
          <ListItem key={bot.id}>
            <StyledLink to={`/bots/${bot.id}`}>
              <LeftGroup>
                <Avatar cid={bot.avatar} />
                {bot.name}
              </LeftGroup>
            </StyledLink>
          </ListItem>
        ))}
      </List>
      <StyledPagination current={page} onChange={handleChangePage} />
    </>
  );
});

interface PurchacedProps {}

const ListingOn: React.FC<PurchacedProps> = React.memo(function ListingOn() {
  const [page, setPage] = useState(1);
  const bots = useSelector(selectBotsListingOn);

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const offset = (page - 1) * limit;

  return (
    <Root>
      <List>
        {bots.slice(offset, offset + limit).map((bot) => (
          <ListItem key={bot.id}>
            <StyledLink to={`/bots/${bot.id}`}>
              <LeftGroup>
                <Avatar cid={bot.avatar} />
                {bot.name}
              </LeftGroup>
              <EditIcon width="24" height="24" />
            </StyledLink>
          </ListItem>
        ))}
      </List>
      <StyledPagination current={page} onChange={handleChangePage} />
    </Root>
  );
});
