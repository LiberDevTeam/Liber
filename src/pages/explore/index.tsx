import React, { useState, useCallback, useEffect } from 'react';
import { Input } from '~/components/input';
import BaseLayout from '~/templates';
import styled, { css } from 'styled-components';
import { SvgSearch as SearchIcon } from '~/icons/Search';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { Tabs } from '~/components/tabs';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList } from 'react-window';
import { Appearance, FeedItem, ItemKind } from '~/state/ducks/feed/feedSlice';
import { theme } from '~/theme';
import {
  fetchSearchPostResult,
  selectSearchPostResult,
} from '~/state/ducks/search/searchSlice';
import FeedItemDefault from '../home/components/feed-item';
import FeedItemBigImage from '../home/components/feed-item-big-image';
import { TabPanel as BaseTabPanel } from 'react-tabs';

const Root = styled.div`
  width: 100%;
  height: 100%;
`;

const ItemContainer = styled.div`
  display: flex;
  border-bottom: ${(props) => props.theme.border.grayLighter.thin};
  padding: ${(props) => props.theme.space[6]}px 0;
`;

const TabPanelContainer = styled.div`
  height: 100%;
`;

const TabPanel = styled(BaseTabPanel)<{ hide: boolean }>`
  flex: 1;
  height: 100vh;
  ${(props) =>
    props.hide &&
    css`
      display: none;
    `}
`;

const TAB_POST = 'post';
const TAB_PLACE = 'place';
const TAB_LIST = [TAB_POST, TAB_PLACE];
const TAB_TITLE = {
  [TAB_POST]: 'Post',
  [TAB_PLACE]: 'Place',
};

export const Explore: React.FC = React.memo(function Explore() {
  const dispatch = useDispatch();
  const { tab } = useParams<{ tab: string }>();
  const [searchText, setSearchText] = useState('');

  const handleSearchTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.currentTarget.value);
    },
    []
  );

  const handleSelect = useCallback((index: number) => {
    dispatch(push(`/explore/${TAB_LIST[index]}`));
  }, []);

  return (
    <BaseLayout
      title="Explore"
      description="Explore best post and place"
      style={{ overflow: 'visible' }}
    >
      <Root>
        <Input
          icon={<SearchIcon width={24} height={24} />}
          value={searchText}
          onChange={handleSearchTextChange}
          placeholder="Search"
        />
        <Tabs
          tabList={TAB_LIST}
          tabTitle={TAB_TITLE}
          selectedTab={tab || TAB_POST}
          onSelect={handleSelect}
        >
          <TabPanelContainer>
            <TabPanel hide={tab !== TAB_POST}>
              <SearchPostResult searchText={searchText} />
            </TabPanel>
            <TabPanel hide={tab !== TAB_PLACE}>
              <SearchResultPlace searchText={searchText} />
            </TabPanel>
          </TabPanelContainer>
        </Tabs>
      </Root>
    </BaseLayout>
  );
});

interface SearchPostResultProps {
  searchText: string;
}

const feedHeight = {
  [Appearance.DEFAULT]: {
    [ItemKind.MESSAGE]: 320 + theme.space[14],
    [ItemKind.PLACE]: 400 + theme.space[4],
  },
  [Appearance.BIG_CARD]: {
    [ItemKind.MESSAGE]: 620 + theme.space[4],
    [ItemKind.PLACE]: 800 + theme.space[4],
  },
};

export const SearchPostResult: React.FC<SearchPostResultProps> = React.memo(
  function SearchResultPost({ searchText }) {
    const dispatch = useDispatch();
    const result = useSelector(selectSearchPostResult);

    useEffect(() => {
      if (result.length > 1) {
        dispatch(
          fetchSearchPostResult({
            searchText,
            lastTimestamp: result[result.length - 1].timestamp,
          })
        );
      } else {
        dispatch(fetchSearchPostResult({ searchText }));
      }
    }, [searchText]);

    return (
      <AutoSizer>
        {({ height, width }) => (
          <VariableSizeList
            height={height}
            itemCount={result.length}
            itemSize={(index) => {
              return feedHeight[result[index].appearance][result[index].kind];
            }}
            width={width}
          >
            {({ index, style }) => (
              <ItemContainer key={result[index].id} style={style}>
                <SearchPostResultItem item={result[index]} />
              </ItemContainer>
            )}
          </VariableSizeList>
        )}
      </AutoSizer>
    );
  }
);

interface SearchPostResultItemProps {
  item: FeedItem;
}

const SearchPostResultItem: React.FC<SearchPostResultItemProps> = ({
  item,
}) => {
  switch (item.appearance) {
    case Appearance.BIG_CARD:
      return <FeedItemBigImage item={item} />;
    case Appearance.DEFAULT:
      return <FeedItemDefault item={item} />;
  }
};

interface SearchResultPlaceProps {
  searchText: string;
}

export const SearchResultPlace: React.FC<SearchResultPlaceProps> = React.memo(
  function SearchResultPlace({ searchText }) {
    return <>Place{searchText}</>;
  }
);
