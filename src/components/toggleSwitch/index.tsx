import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const commonTransition = (property: string) =>
  `transition: ${property} .2s ease-out`;

const Root = styled.label<RootProps>`
  display: block;
  position: relative;
  box-sizing: border-box;
  width: ${(props) => props.width}px;
  height: ${(props) => props.width / 2}px;
  border-radius: ${(props) => props.width / 2}px;
  background-color: ${(props) =>
    props.checked ? props.theme.colors.primary : props.theme.colors.bg4};
  transform: 0;
  cursor: pointer;
  ${commonTransition('background-color')};
  &::before {
    content: '';
    position: absolute;
    left: ${(props) => (props.checked ? `${props.width / 2}px` : '0')};
    margin: ${(props) => props.theme.space[1] / 2}px;
    width: ${(props) => props.width / 2 - props.theme.space[1]}px;
    height: ${(props) => props.width / 2 - props.theme.space[1]}px;
    border-radius: 100%;
    background-color: ${(props) => props.theme.colors.bg};
    ${commonTransition('left')};
  }
`;

const Input = styled.input`
  display: none;
`;

type RootProps = {
  checked: boolean;
  width: number;
};

export type ToggleSwitchProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> & {
  onChange: (checked: boolean) => void;
  width?: number;
};

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  children,
  onChange,
  width = 50,
  checked = false,
  ...args
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  useEffect(() => {
    onChange(isChecked);
  }, [isChecked, onChange]);

  return (
    <Root width={width} checked={isChecked}>
      <Input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
        {...args}
      />
    </Root>
  );
};
