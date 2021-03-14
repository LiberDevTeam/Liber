import React from 'react';
import { BottomNavLink } from '~/components/atoms/bottom-nav-link';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Forum as MessagesIcon,
  Store as MarketplaceIcon,
  AccountCircle as ProfileIcon,
} from '@material-ui/icons';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
`;

export const BottomNavigation: React.FC = React.memo(
  function BottomNavigation() {
    return (
      <Root>
        <BottomNavLink exact icon={<HomeIcon />} to="/">
          Home
        </BottomNavLink>
        <BottomNavLink exact icon={<SearchIcon />} to="/explore">
          Explore
        </BottomNavLink>
        <BottomNavLink exact icon={<MessagesIcon />} to="/places">
          Chats
        </BottomNavLink>
        <BottomNavLink exact icon={<MarketplaceIcon />} to="/marketplace">
          Marketplace
        </BottomNavLink>
        <BottomNavLink icon={<ProfileIcon />} to="/profile">
          Profile
        </BottomNavLink>
      </Root>
    );
  }
);
