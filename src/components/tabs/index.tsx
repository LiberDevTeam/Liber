import React, { CSSProperties } from 'react';
import {
  Tab as BaseTab,
  Tabs as BaseTabs,
  TabList as BaseTabList,
  TabPanel as BaseTabPanel,
} from 'react-tabs';
import styled, { css } from 'styled-components';

const TabList = styled(BaseTabList)`
  display: flex;
  justify-content: space-around;
  padding: 0;
  border-bottom: ${(props) => props.theme.border.grayLighter.light};
`;

const Tab = styled(BaseTab)<{ active: boolean }>`
  list-style: none;
  padding: ${(props) => props.theme.space[2]}px
    ${(props) => props.theme.space[4]}px ${(props) => props.theme.space[3]}px;
  min-width: 100px;
  text-align: center;
  ${(props) =>
    props.active &&
    css`
      color: ${(props) => props.theme.colors.primary};
      border-bottom: ${(props) => props.theme.border.primary.light};
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
          <Tab key={tab} active={tab === selectedTab}>
            {tabTitle[tab]}
          </Tab>
        ))}
      </TabList>
      {children}
    </BaseTabs>
  );
});

interface TabPanelProps {
  hide?: boolean;
  children: React.ReactNode;
}
