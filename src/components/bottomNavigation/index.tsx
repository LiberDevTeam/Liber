import React from 'react';
import { BottomNavLink } from '~/components/bottomNavigation/bottomNavLink';
import { SvgPeople as ProfileIcon } from '~/icons/People';
import { SvgSearch as SearchIcon } from '~/icons/Search';
import { SvgHome as HomeIcon } from '~/icons/Home';
import { SvgMessageSquare as MessagesIcon } from '~/icons/MessageSquare';
import { SvgShoppingBag as MarketplaceIcon } from '~/icons/ShoppingBag';
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
        <BottomNavLink exact icon={<HomeIcon width={24} height={24} />} to="/">
          Home
        </BottomNavLink>
        <BottomNavLink
          exact
          icon={<SearchIcon width={24} height={24} />}
          to="/explore"
        >
          Explore
        </BottomNavLink>
        <BottomNavLink
          icon={<MessagesIcon width={24} height={24} />}
          to="/places"
        >
          Chats
        </BottomNavLink>
        <BottomNavLink
          exact
          icon={<MarketplaceIcon width={24} height={24} />}
          to="/marketplace"
        >
          Marketplace
        </BottomNavLink>
        <BottomNavLink
          icon={<ProfileIcon width={24} height={24} />}
          to="/profile"
        >
          Profile
        </BottomNavLink>
      </Root>
    );
  }
);
