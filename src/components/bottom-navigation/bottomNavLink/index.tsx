import React, { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const activeClassName = 'selected';
const StyledNavLink = styled(NavLink)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: ${(props) => props.theme.colors.secondaryText};
  text-decoration: none;
  font-weight: ${(props) => props.theme.fontWeights.light};
  font-size: ${(props) => props.theme.fontSizes.xs};

  &.${activeClassName} {
    color: ${(props) => props.theme.colors.primary};

    svg {
      color: ${(props) => props.theme.colors.primary};
    }

    span {
      font-weight: ${(props) => props.theme.fontWeights.bold};
    }
  }
`;

const LinkText = styled.span`
  padding-top: ${(props) => props.theme.space[3]}px;
`;

export interface BottomNavLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  exact?: boolean;
}

export const BottomNavLink: React.FC<BottomNavLinkProps> = React.memo(
  function SideNavLink({ to, icon, children, exact = false }) {
    const isActive = useCallback((match, location) => {
      if (to === '/') {
        return !!match;
      }
      return location.pathname.startsWith(to);
    }, []);
    return (
      <StyledNavLink
        exact={exact}
        to={to}
        activeClassName={activeClassName}
        isActive={isActive}
      >
        {icon}
        <LinkText>{children}</LinkText>
      </StyledNavLink>
    );
  }
);
