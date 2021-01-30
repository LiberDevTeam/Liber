import React from 'react';
import styled from 'styled-components';

type ButtonVariant = 'solid' | 'outline';

interface RootProps {
  rounded: boolean;
  variant: ButtonVariant;
}

const Root = styled.button<RootProps>`
  font-family: ${(props) => props.theme.fontFamily.body};
  font-size: ${(props) => props.theme.fontSizes.lg};
  color: ${(props) =>
    props.variant === 'solid'
      ? props.theme.colors.lightText
      : props.theme.colors.primary};
  background: ${(props) =>
    props.variant === 'solid'
      ? props.theme.colors.primary
      : props.theme.colors.bg};
  padding: 10px 20px;
  border: 1px solid ${(props) => props.theme.colors.primary};
  border-style: solid;
  border-radius: ${(props) =>
    props.rounded ? props.theme.radii.large : props.theme.radii.medium}px;
  box-shadow: ${(props) =>
    props.variant === 'solid'
      ? props.theme.shadows[1]
      : props.theme.shadows[0]};
`;

export interface ButtonProps {
  variant?: ButtonVariant;
  shape: 'square' | 'rounded';
  text: string;
}

export const Button: React.FC<ButtonProps> = React.memo(function Button({
  variant = 'solid',
  text,
  shape,
}) {
  return (
    <Root rounded={shape === 'rounded'} variant={variant}>
      {text}
    </Root>
  );
});
