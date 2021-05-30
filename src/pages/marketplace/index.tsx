import React, { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Input } from '~/components/input';
import { TabPanel, TabPanels, Tabs } from '~/components/tabs';
import { SvgSearch as SearchIcon } from '~/icons/Search';
import BaseLayout from '~/templates';
import { BotNew } from './components/bot-new';
import { BotRanking } from './components/bot-ranking';
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

const StyledLink = styled(Link)<{ active: string }>`
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
    props.active === 'true' &&
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

const types = ['bots', 'stickers'];

const tabTitles = ['Ranking', 'New'];

export const MarketplacePage: React.FC = React.memo(function MarketplacePage() {
  const { type = types[0] } =
    useParams<{
      type?: string;
    }>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchText, setSearchText] = useState('');

  const handleSearchTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.currentTarget.value);
    },
    []
  );

  return (
    <BaseLayout title="Marketplace" description="Explore best sticker and bot">
      <Contents>
        <Input
          icon={<SearchIcon width={24} height={24} />}
          value={searchText}
          onChange={handleSearchTextChange}
          placeholder="Search"
        />
        <SelectorGroup>
          <StyledLink
            active={(type === types[0]).toString()}
            to={`/marketplace/${types[0]}`}
          >
            <CircleImage src="/img/marketplace/bots_icon.png" />
            <SelectorTitle>Bots</SelectorTitle>
          </StyledLink>
          <StyledLink
            active={(type === types[1]).toString()}
            to={`/marketplace/${types[1]}`}
          >
            <CircleImage src="/img/marketplace/stickers_icon.png" />
            <SelectorTitle>Stickers</SelectorTitle>
          </StyledLink>
        </SelectorGroup>

        {searchText.length === 0 && (
          <Tabs
            titles={tabTitles}
            selectedIndex={selectedIndex}
            onSelect={(index: number) => setSelectedIndex(index)}
          >
            <TabPanels>
              <TabPanel>
                {type === types[0] && <BotRanking />}
                {type === types[1] && <StickerRanking />}
              </TabPanel>
              <TabPanel>
                {type === types[0] && <BotNew />}
                {type === types[1] && <StickerNew />}
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}

        {searchText.length !== 0 && (
          <>
            {type === types[0] && <SearchBotResult searchText={searchText} />}
            {type === types[1] && (
              <SearchStickerResult searchText={searchText} />
            )}
          </>
        )}
      </Contents>
    </BaseLayout>
  );
});
