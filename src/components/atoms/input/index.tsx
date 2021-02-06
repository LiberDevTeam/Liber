import React from 'react';
import styled, { css } from 'styled-components';

const Root = styled.div`
  display: block;
  width: 100%;
  position: relative;
  background: ${(props) => props.theme.colors.bg3};
  font-weight: ${(props) => props.theme.fontWeights.normal};
  font-size: ${(props) => props.theme.fontSizes.md};
  border-radius: ${(props) => props.theme.radii.large}px;
`;

const InnerInput = styled.input<{ hasIcon: boolean }>`
  display: block;
  width: 100%;
  background: ${(props) => props.theme.colors.bg3};
  padding: ${(props) => `${props.theme.space[3]}px ${props.theme.space[5]}px`};
  border: none;
  border-radius: ${(props) => props.theme.radii.large}px;
  text-overflow: ellipsis;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: ${(props) => props.theme.colors.lightPrimary} 0px 0px 0px 2px;
    outline: none;
  }

  ::placeholder {
    color: ${(props) => props.theme.colors.secondaryText};
  }

  ${(props) =>
    props.hasIcon &&
    css`
      padding-left: ${(props) => props.theme.space[11]}px;
    `}
`;

const IconWrapper = styled.span`
  position: absolute;
  height: 40px;
  left: ${(props) => props.theme.space[3]}px;
  color: ${(props) => props.theme.colors.secondaryText};
  display: flex;
  align-items: center;
  justify-content: center;
`;

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
};

export const Input: React.FC<InputProps> = React.memo(function Input({
  icon,
  className,
  ...rest
}) {
  return (
    <Root className={className}>
      <IconWrapper>{icon}</IconWrapper>
      <InnerInput {...rest} hasIcon={Boolean(icon)} />
    </Root>
  );
});
