import { push } from 'connected-react-router';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { TabPanel as BaseTabPanel } from 'react-tabs';
import styled, { css } from 'styled-components';
import { Input } from '~/components/input';
import { Tabs } from '~/components/tabs';
import { SvgSearch as SearchIcon } from '~/icons/Search';
import BaseLayout from '~/templates';
import { SearchPlaceResult } from './component/search-place-result';
import { SearchPostResult } from './component/search-post-result';

const Root = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 ${(props) => props.theme.space[5]}px;
`;

const TabPanelContainer = styled.div`
  height: 100%;
`;

const TabPanel = styled(BaseTabPanel)<{ hide?: boolean }>`
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
  const { tab = TAB_POST } = useParams<{ tab: string }>();
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
          selectedTab={tab}
          onSelect={handleSelect}
        >
          <TabPanelContainer>
            <TabPanel hide={tab !== TAB_POST}>
              <SearchPostResult searchText={searchText} />
            </TabPanel>
            <TabPanel hide={tab !== TAB_PLACE}>
              <SearchPlaceResult searchText={searchText} />
            </TabPanel>
          </TabPanelContainer>
        </Tabs>
      </Root>
    </BaseLayout>
  );
});
