import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '~/components/button';
import { TabPanel, TabPanels, Tabs } from '~/components/tabs';
import {
  selectPurchasedStickers,
  selectStickersListingOn,
} from '~/state/mypage/stickersSlice';
import BaseLayout from '~/templates';
import { StickerListTabPanel } from './components/sticker-list-tab-panel';

const StyledButton = styled(Button)`
  width: 100%;
`;

const StyledButtonLink = styled(Link)`
  margin: 0 ${(props) => props.theme.space[4]}px;
  margin-bottom: ${(props) => props.theme.space[3]}px;
`;

const tabTitles = ['Listing on', 'Purchased'];

export const StickersPage: React.FC = React.memo(function StickersPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <BaseLayout
      title="Stickers"
      description="Manage your Stickers settings"
      backTo="/profile"
    >
      <StyledButtonLink to="/stickers/new">
        <StyledButton shape="rounded" text="SELL YOUR ORIGINAL STICKER!" />
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
  const stickers = useSelector(selectPurchasedStickers);

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const offset = (page - 1) * limit;

  return (
    <StickerListTabPanel
      offset={offset}
      limit={limit}
      stickers={stickers}
      page={page}
      onChangePage={handleChangePage}
    />
  );
});

const ListingOn: React.FC = React.memo(function ListingOn() {
  const [page, setPage] = useState(1);
  const stickers = useSelector(selectStickersListingOn);

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const offset = (page - 1) * limit;

  return (
    <StickerListTabPanel
      offset={offset}
      limit={limit}
      stickers={stickers}
      page={page}
      onChangePage={handleChangePage}
    />
  );
});
