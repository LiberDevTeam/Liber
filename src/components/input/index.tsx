import React from 'react';
import styled, { css } from 'styled-components';

const Root = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  background: ${(props) => props.theme.colors.bgGray};
  font-weight: ${(props) => props.theme.fontWeights.normal};
  font-size: ${(props) => props.theme.fontSizes.sm};
  line-height: ${(props) => props.theme.fontSizes.xl};
  border-radius: ${(props) => props.theme.radii.xl}px;
  padding: ${(props) => `${props.theme.space[4]}px ${props.theme.space[5]}px`};
`;

const InnerInput = styled.input<{ hasIcon: boolean }>`
  display: block;
  width: 100%;
  background: ${(props) => props.theme.colors.bgGray};
  border: none;
  border-radius: ${(props) => props.theme.radii.xl}px;
  text-overflow: ellipsis;
  outline: none;

  ::placeholder {
    color: ${(props) => props.theme.colors.secondaryText};
  }

  ${(props) =>
    props.hasIcon &&
    css`
      padding-left: ${(props) => props.theme.space[2]}px;
    `}
`;

const IconWrapper = styled.span`
  left: ${(props) => props.theme.space[3]}px;
  color: ${(props) => props.theme.colors.secondaryText};
  display: flex;
  align-items: center;
  justify-content: center;
`;

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
  innerRef?:
    | ((instance: HTMLInputElement | null) => void)
    | React.RefObject<HTMLInputElement>
    | null
    | undefined;
  actions?: React.ReactNode;
};

export const Input: React.FC<InputProps> = React.memo(function Input({
  icon,
  className,
  innerRef,
  actions,
  ...rest
}) {
  return (
    <Root className={className}>
      <IconWrapper>{icon}</IconWrapper>
      <InnerInput {...rest} ref={innerRef} hasIcon={Boolean(icon)} />
      {actions}
    </Root>
  );
});