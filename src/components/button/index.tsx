import React from 'react';
import styled, { css } from 'styled-components';

type ButtonVariant = 'solid' | 'outline' | 'text';

interface RootProps {
  height: number;
  rounded: boolean;
  variant: ButtonVariant;
  disabled: boolean;
}

const Root = styled.button<RootProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: ${(props) => props.height}px;

  color: ${(props) => props.theme.colors.primary};
  font-family: ${(props) => props.theme.fontFamily.body};
  font-weight: ${(props) => props.theme.fontWeights.light};
  font-size: ${(props) => props.theme.fontSizes.md};

  cursor: pointer;

  background: ${(props) => props.theme.colors.bg};
  padding: 0px 20px;

  border: 1px solid ${(props) => props.theme.colors.primary};
  border-style: solid;
  border-radius: ${(props) =>
    props.rounded ? props.height / 2 : props.theme.radii.medium}px;

  &:focus {
    box-shadow: ${(props) => props.theme.colors.lightPrimary} 0px 0px 0px 2px;
    outline: none;
  }

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }

  // solid
  ${(props) => {
    switch (props.variant) {
      case 'solid':
        return css`
          color: ${props.theme.colors.lightText};
          background: ${props.theme.colors.primary};
        `;

      case 'text':
        return css`
          border: none;
          background: none;
        `;
    }
  }}

  ${(props) =>
    props.disabled &&
    css`
      color: ${props.theme.colors.lightText};
      border-color: ${props.theme.colors.disabled};
      background: ${props.theme.colors.disabled};
    `}
`;

const IconWrapper = styled.span`
  width: 24px;
  height: 24px;
  margin-right: ${(props) => props.theme.space[2]}px;
`;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  shape: 'square' | 'rounded';
  text: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  height?: number;
}

export const Button: React.FC<ButtonProps> = React.memo(function Button({
  variant = 'solid',
  icon,
  text,
  shape,
  disabled = false,
  height = 40,
  ...args
}) {
  return (
    <Root
      rounded={shape === 'rounded'}
      variant={variant}
      disabled={disabled}
      height={height}
      {...args}
    >
      {icon ? <IconWrapper>{icon}</IconWrapper> : null}
      {text}
    </Root>
  );
});
