import React from 'react';
import { BottomNavLink } from '~/components/atoms/bottom-nav-link';
import {
  Search as SearchIcon,
  Forum as MessagesIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  padding: ${(props) => props.theme.space[3]}px;
  justify-content: space-around;
  width: 100%;
`;

export const BottomNavigation: React.FC = React.memo(
  function BottomNavigation() {
    return (
      <Root>
        <BottomNavLink exact icon={<SearchIcon />} to="/">
          Explore
        </BottomNavLink>
        <BottomNavLink exact icon={<MessagesIcon />} to="/places">
          Chats
        </BottomNavLink>
        <BottomNavLink icon={<SettingsIcon />} to="/settings">
          Settings
        </BottomNavLink>
      </Root>
    );
  }
);
