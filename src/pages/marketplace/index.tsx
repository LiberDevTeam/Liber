import { push } from 'connected-react-router';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Input } from '~/components/input';
import { TabPanel, TabPanels, Tabs } from '~/components/tabs';
import { SvgSearch as SearchIcon } from '~/icons/Search';
import { useQuery } from '~/lib/queryParams';
import BaseLayout from '~/templates';
import { BotNew } from './components/bot-new';
import { BotRanking } from './components/bot-ranking';
import {
  MarketplaceKind,
  MarketplaceTabPanel,
  TAB_TITLE,
} from './components/constants';
import { SearchBotResult } from './components/search-bot-result';
import { SearchStickerResult } from './components/search-sticker-result';
import { StickerNew } from './components/sticker-new';
import { StickerRanking } from './components/sticker-ranking';

const Contents = styled.div`
  padding: 0 ${(props) => props.theme.space[5]}px;
`;

const CircleImage = styled.img`
  height: 44px;
  weight: 44px;
  margin-right: ${(props) => props.theme.space[3]}px;
`;

const StyledLink = styled(Link)<{ active: boolean }>`
  width: 48%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.colors.primaryText};
  padding: ${(props) => props.theme.space[3]}px 0;
  border-radius: ${(props) => props.theme.radii.medium}px;
  border: ${(props) => props.theme.border.grayLighter.light};
  ${(props) =>
    props.active === true &&
    css`
      border: ${(props) => props.theme.border.primary.light};
    `}
`;

const SelectorGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${(props) => props.theme.space[7]}px;
`;

const SelectorTitle = styled.div`
  width: 65px;
`;

interface Props {}

export const MarketplacePage: React.FC<Props> = React.memo(
  function MarketplacePage({}) {
    const dispatch = useDispatch();
    const { kind = MarketplaceKind.Bots } = useParams<{
      kind?: MarketplaceKind;
    }>();
    const { tab = MarketplaceTabPanel.Ranking } = useQuery<{
      tab: MarketplaceTabPanel;
    }>();

    const [searchText, setSearchText] = useState('');

    const handleSelect = useCallback(
      (index: number) => {
        dispatch(
          push(
            `/marketplace/${kind}?tab=${
              Object.values(MarketplaceTabPanel)[index]
            }`
          )
        );
      },
      [kind, tab]
    );

    const handleSearchTextChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.currentTarget.value);
      },
      []
    );

    return (
      <BaseLayout
        title="Marketplace"
        description="Explore best sticker and bot"
      >
        <Contents>
          <Input
            icon={<SearchIcon width={24} height={24} />}
            value={searchText}
            onChange={handleSearchTextChange}
            placeholder="Search"
          />
          <SelectorGroup>
            <StyledLink
              active={kind === MarketplaceKind.Bots}
              to={`/marketplace/${MarketplaceKind.Bots}`}
            >
              <CircleImage src="/img/marketplace/bots_icon.png" />
              <SelectorTitle>Bots</SelectorTitle>
            </StyledLink>
            <StyledLink
              active={kind === MarketplaceKind.Stickers}
              to={`/marketplace/${MarketplaceKind.Stickers}`}
            >
              <CircleImage src="/img/marketplace/stickers_icon.png" />
              <SelectorTitle>Stickers</SelectorTitle>
            </StyledLink>
          </SelectorGroup>

          {searchText.length === 0 && (
            <Tabs
              tabList={Object.values(MarketplaceTabPanel)}
              tabTitle={TAB_TITLE}
              selectedTab={tab}
              onSelect={handleSelect}
            >
              <TabPanels>
                <TabPanel hide={tab !== MarketplaceTabPanel.Ranking}>
                  {kind === MarketplaceKind.Stickers && <StickerRanking />}
                  {kind === MarketplaceKind.Bots && <BotRanking />}
                </TabPanel>
                <TabPanel hide={tab !== MarketplaceTabPanel.New}>
                  {kind === MarketplaceKind.Stickers && <StickerNew />}
                  {kind === MarketplaceKind.Bots && <BotNew />}
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}

          {searchText.length !== 0 && (
            <>
              {kind === MarketplaceKind.Stickers && (
                <SearchStickerResult searchText={searchText} />
              )}
              {kind === MarketplaceKind.Bots && (
                <SearchBotResult searchText={searchText} />
              )}
            </>
          )}
        </Contents>
      </BaseLayout>
    );
  }
);
