import React from 'react';
import styled, { css } from 'styled-components';
import { ErrorMessage } from '../error-message';

const Root = styled.div``;

const Container = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  background: ${(props) => props.theme.colors.bgGray};
  font-weight: ${(props) => props.theme.fontWeights.thin};
  font-size: ${(props) => props.theme.fontSizes.md};
  line-height: ${(props) => props.theme.fontSizes.xl};
  border-radius: ${(props) => props.theme.radii.xl}px;
  padding: ${(props) => `${props.theme.space[4]}px ${props.theme.space[5]}px`};
`;

const InnerInput = styled.input<{ hasIcon: boolean; textCenter?: boolean }>`
  display: block;
  background: none;
  width: 100%;
  border: none;
  border-radius: ${(props) => props.theme.radii.xl}px;
  text-overflow: ellipsis;
  outline: none;
  padding-left: ${(props) => props.theme.space[1]}px;

  ::placeholder {
    color: ${(props) => props.theme.colors.secondaryText};
  }

  ${(props) =>
    props.textCenter &&
    css`
      text-align: center;
    `}

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

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  innerRef?:
    | ((instance: HTMLInputElement | null) => void)
    | React.RefObject<HTMLInputElement>
    | null
    | undefined;
  actions?: React.ReactNode;
  textCenter?: boolean;
  errorMessage?: string;
}

export const Input: React.FC<InputProps> = React.memo(function Input({
  icon,
  className,
  innerRef,
  actions,
  style,
  errorMessage,
  ...rest
}) {
  return (
    <Root className={className}>
      <Container style={style}>
        <IconWrapper>{icon}</IconWrapper>
        <InnerInput {...rest} ref={innerRef} hasIcon={Boolean(icon)} />
        {actions}
      </Container>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </Root>
  );
});
