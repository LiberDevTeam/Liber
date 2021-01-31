import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const activeClassName = 'selected';
const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  height: 48px;
  padding-left: ${(props) => props.theme.space[4]}px;
  color: ${(props) => props.theme.colors.secondaryText};
  font-size: ${(props) => props.theme.fontSizes.lg};
  border-radius: ${(props) => props.theme.radii.medium}px;

  &.${activeClassName} {
    color: ${(props) => props.theme.colors.lightText};
    background: ${(props) => props.theme.colors.primary};
  }
`;

const LinkText = styled.span`
  margin-left: ${(props) => props.theme.space[5]}px;
`;

export interface SideNavLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  exact?: boolean;
}

export const SideNavLink: React.FC<SideNavLinkProps> = React.memo(
  function SideNavLink({ to, icon, children, exact = false }) {
    return (
      <StyledNavLink exact={exact} to={to} activeClassName={activeClassName}>
        {icon}
        <LinkText>{children}</LinkText>
      </StyledNavLink>
    );
  }
);
