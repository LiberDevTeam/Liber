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
  border-bottom: ${(props) => props.theme.border.gray2[2]};
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

export const TabPanels = styled.div``;

export const TabPanel = styled(BaseTabPanel)``;

export type TabTitle = string;

interface TabsProps {
  titles: TabTitle[];
  selectedIndex: number;
  onSelect: (index: number, last: number, event: Event) => boolean | void;
}

export const Tabs: React.FC<TabsProps> = React.memo(function Tabs({
  titles,
  selectedIndex,
  children,
  onSelect,
}) {
  return (
    <BaseTabs selectedIndex={selectedIndex} onSelect={onSelect}>
      <TabList>
        {titles.map((title, index) => (
          <Tab
            key={title}
            active={(index === selectedIndex).toString()}
            title={title}
          >
            {title}
          </Tab>
        ))}
      </TabList>
      {children}
    </BaseTabs>
  );
});
