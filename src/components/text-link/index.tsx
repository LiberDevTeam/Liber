import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledTextLink = styled(Link)`
  display: flex;
  align-items: center;
  height: 48px;
  color: ${(props) => props.theme.colors.secondaryText};
  font-size: ${(props) => props.theme.fontSizes.lg};
  text-decoration: none;
`;

const LinkText = styled.span``;

export interface TextLinkProps {
  to: string;
  children: React.ReactNode;
}

export const TextLink: React.FC<TextLinkProps> = React.memo(
  function SideNavLink({ to, children }) {
    return (
      <StyledTextLink to={to}>
        <LinkText>{children}</LinkText>
      </StyledTextLink>
    );
  }
);
