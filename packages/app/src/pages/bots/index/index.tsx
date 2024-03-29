import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '~/components/button';
import { TabPanel, TabPanels, Tabs } from '~/components/tabs';
import { selectBotsListingOn, selectPurchasedBots } from '~/state/me/meSlice';
import BaseLayout from '~/templates';
import { BotListTabPanel } from './bot-list-tab-panel';

const StyledButton = styled(Button)`
  width: 100%;
`;

const StyledButtonLink = styled(Link)`
  margin: 0 ${(props) => props.theme.space[4]}px;
  margin-bottom: ${(props) => props.theme.space[3]}px;
`;

const tabTitles = ['Listing on', 'Purchased'];

export const Bots: React.FC = React.memo(function BotsPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);

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
        titles={tabTitles}
        selectedIndex={selectedIndex}
        onSelect={(index: number) => setSelectedIndex(index)}
      >
        <TabPanels>
          <TabPanel>
            <ListingOn />
          </TabPanel>
          <TabPanel>
            <Purchased />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </BaseLayout>
  );
});

const limit = 10;

const Purchased: React.FC = React.memo(function Purchased() {
  const [page, setPage] = useState(1);
  const bots = useSelector(selectPurchasedBots);

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const offset = (page - 1) * limit;
  const botIds = bots.map((bot) => bot.botId);

  return (
    <BotListTabPanel
      botIds={botIds}
      offset={offset}
      limit={limit}
      page={page}
      onChangePage={handleChangePage}
    />
  );
});

const ListingOn: React.FC = React.memo(function ListingOn() {
  const [page, setPage] = useState(1);
  const bots = useSelector(selectBotsListingOn);

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const offset = (page - 1) * limit;
  const botIds = bots.map((bot) => bot.botId);

  return (
    <BotListTabPanel
      botIds={botIds}
      offset={offset}
      limit={limit}
      page={page}
      onChangePage={handleChangePage}
    />
  );
});
