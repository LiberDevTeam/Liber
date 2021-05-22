import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Input } from '~/components/input';
import { TabPanel, TabPanels, Tabs } from '~/components/tabs';
import { SvgSearch as SearchIcon } from '~/icons/Search';
import BaseLayout from '~/templates';
import { SearchPlaceResult } from './component/search-place-result';
import { SearchPostResult } from './component/search-post-result';

const Root = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 ${(props) => props.theme.space[5]}px;
`;

const tabTitles = ['Message', 'Place'];

export const Explore: React.FC = React.memo(function Explore() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchText, setSearchText] = useState('');

  const handleSearchTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.currentTarget.value);
    },
    []
  );

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
          titles={tabTitles}
          selectedIndex={selectedIndex}
          onSelect={(index: number) => setSelectedIndex(index)}
        >
          <TabPanels>
            <TabPanel>
              <SearchPostResult searchText={searchText} />
            </TabPanel>
            <TabPanel>
              <SearchPlaceResult searchText={searchText} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Root>
    </BaseLayout>
  );
});
