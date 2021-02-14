import React from 'react';
import styled from 'styled-components';

const Root = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-color: transparent;
  background: transparent;
  padding: 0;
  border-radius: ${(props) => props.theme.radii.medium}px;

  &:focus {
    box-shadow: ${(props) => props.theme.colors.lightPrimary} 0px 0px 0px 2px;
    outline: none;
  }

  &:active {
    opacity: 0.8;
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
