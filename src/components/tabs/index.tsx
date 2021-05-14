import React from 'react';
import {
  Tab as BaseTab,
  TabList as BaseTabList,
  TabPanel as BaseTabPanel,
  Tabs as BaseTabs,
} from 'react-tabs';
import styled, { css } from 'styled-components';

const TabList = styled(BaseTabList)`
  display: flex;
  justify-content: space-around;
  padding: 0;
  border-bottom: ${(props) => props.theme.border.grayLighter.light};
`;

const Tab = styled(BaseTab)<{ active: string }>`
  list-style: none;
  padding: ${(props) => props.theme.space[2]}px
    ${(props) => props.theme.space[4]}px ${(props) => props.theme.space[3]}px;
  text-align: center;
  ${(props) =>
    props.active === 'true' &&
    css`
      color: ${(props) => props.theme.colors.primary};
      border-bottom: ${(props) => props.theme.border.primary.light};
    `}
`;

export const TabPanels = styled.div`
  overflow: scroll;
`;

export const TabPanel = styled(BaseTabPanel)<{ hide?: boolean }>`
  flex: 1;
  ${(props) =>
    props.hide &&
    css`
      display: none;
    `}
`;

interface TabsProps {
  tabList: string[];
  tabTitle: Record<string, string>;
  children: React.ReactNode;
  selectedTab: string;
  onSelect: (index: number, last: number, event: Event) => boolean | void;
}

export const Tabs: React.FC<TabsProps> = React.memo(function Tabs({
  tabList,
  tabTitle,
  children,
  selectedTab,
  onSelect,
}) {
  return (
    <BaseTabs
      selectedIndex={tabList.findIndex((index) => index === selectedTab)}
      onSelect={onSelect}
    >
      <TabList>
        {tabList.map((tab) => (
          <Tab key={tab} active={(tab === selectedTab).toString()}>
            {tabTitle[tab]}
          </Tab>
        ))}
      </TabList>
      {children}
    </BaseTabs>
  );
});
