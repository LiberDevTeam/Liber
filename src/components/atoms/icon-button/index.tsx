import React from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';

const Root = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-color: transparent;
  background: transparent;
  padding: 0;
  border-radius: ${(props) => props.theme.radii.medium}px;
  color: ${(props) => props.theme.colors.primary};

  &:focus {
    box-shadow: ${(props) => props.theme.colors.lightPrimary} 0px 0px 0px 2px;
    outline: none;
  }

  &:hover {
    color: ${(props) => lighten(0.1, props.theme.colors.primary)};
  }

  &:active {
    color: ${(props) => lighten(0.2, props.theme.colors.primary)};
  }
`;

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
};

export const IconButton: React.FC<IconButtonProps> = React.memo(
  function IconButton({ icon, ...args }) {
    return <Root {...args}>{icon}</Root>;
  }
);
