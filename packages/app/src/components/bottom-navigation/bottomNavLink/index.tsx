import React from 'react';
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
  padding: ${(props) => props.theme.space[1]}px 0
    ${(props) => props.theme.space[3]}px;
`;

export interface BottomNavLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  exact?: boolean;
}

export const BottomNavLink: React.FC<BottomNavLinkProps> = React.memo(
  function SideNavLink({ to, icon, children, exact = false }) {
    return (
      <StyledNavLink
        end={exact}
        to={to}
        className={({ isActive }) => (isActive ? activeClassName : '')}
      >
        {icon}
        <LinkText>{children}</LinkText>
      </StyledNavLink>
    );
  }
);
