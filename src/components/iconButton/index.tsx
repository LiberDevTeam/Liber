import React from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';
import { theme } from '~/theme';

const Root = styled.button<{ color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-color: transparent;
  background: transparent;
  padding: 0;
  border-radius: ${(props) => props.theme.radii.medium}px;
  color: ${(props) => props.color};

  &:focus {
    box-shadow: ${(props) => props.color} 0px 0px 0px 2px;
    outline: none;
  }

  &:hover {
    color: ${(props) => lighten(0.1, props.color)};
  }

  &:active {
    color: ${(props) => lighten(0.2, props.color)};
  }
`;

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  color?: string;
}

export const IconButton: React.FC<IconButtonProps> = React.memo(
  function IconButton({ icon, color = theme.colors.primaryText, ...args }) {
    return (
      <Root {...args} color={color}>
        {icon}
      </Root>
    );
  }
);
