import React from 'react';
import styled, { css } from 'styled-components';

type ButtonVariant = 'solid' | 'outline';

interface RootProps {
  rounded: boolean;
  variant: ButtonVariant;
}

const Root = styled.button<RootProps>`
  display: inline-flex;
  min-width: 200px;
  align-items: center;
  justify-content: center;
  height: 40px;

  color: ${(props) => props.theme.colors.primary};
  font-family: ${(props) => props.theme.fontFamily.body};
  font-weight: ${(props) => props.theme.fontWeights.light};
  font-size: ${(props) => props.theme.fontSizes.md};

  background: ${(props) => props.theme.colors.bg};
  padding: 0px 20px;

  border: 1px solid ${(props) => props.theme.colors.primary};
  border-style: solid;
  border-radius: ${(props) =>
    props.rounded ? props.theme.radii.large : props.theme.radii.medium}px;

  &:focus {
    box-shadow: ${(props) => props.theme.colors.lightPrimary} 0px 0px 0px 2px;
    outline: none;
  }

  &:active {
    opacity: 0.8;
  }

  // solid
  ${(props) =>
    props.variant === 'solid' &&
    css`
      color: ${props.theme.colors.lightText};
      background: ${props.theme.colors.primary};
    `}
`;

const IconWrapper = styled.span`
  width: 18px;
  height: 18px;
  margin-right: ${(props) => props.theme.space[2]}px;
  & > svg {
    font-size: ${(props) => props.theme.fontSizes.lg};
  }
`;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  shape: 'square' | 'rounded';
  text: string;
  icon?: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = React.memo(function Button({
  variant = 'solid',
  icon,
  text,
  shape,
  ...args
}) {
  return (
    <Root rounded={shape === 'rounded'} variant={variant} {...args}>
      {icon ? <IconWrapper>{icon}</IconWrapper> : null}
      {text}
    </Root>
  );
});
