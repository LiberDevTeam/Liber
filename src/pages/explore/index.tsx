import React, { useState, useCallback } from 'react';
import { Input } from '~/components/input';
import BaseLayout from '~/templates';
import styled from 'styled-components';
import { SvgSearch as SearchIcon } from '~/icons/Search';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { Tabs } from '~/components/tabs';
import { TabPanel } from 'react-tabs';

const Root = styled.div`
  width: 100%;
  height: 100%;
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
    <BaseLayout title="Explore" description="Explore best post and place">
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
          <TabPanel>
            <SearchResultPost searchText={searchText} />
          </TabPanel>
          <TabPanel>
            <SearchResultPlace searchText={searchText} />
          </TabPanel>
        </Tabs>
      </Root>
    </BaseLayout>
  );
});

interface SearchResultPostProps {
  searchText: string;
}

export const SearchResultPost: React.FC<SearchResultPostProps> = React.memo(
  function SearchResultPost({ searchText }) {
    return <>Post{searchText}</>;
  }
);

interface SearchResultPlaceProps {
  searchText: string;
}

export const SearchResultPlace: React.FC<SearchResultPlaceProps> = React.memo(
  function SearchResultPlace({ searchText }) {
    return <>Place{searchText}</>;
  }
);
