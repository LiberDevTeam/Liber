import RcDropdown from 'rc-dropdown';
import 'rc-dropdown/assets/index.css';
import { DropdownProps } from 'rc-dropdown/lib/Dropdown';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import styled, { css, useTheme } from 'styled-components';
import { Button } from '../button';

const menuStyle = css`
  color: ${(props) => props.theme.colors.primaryText};
  width: 100%;
  justify-content: flex-start;
  font-weight: ${(props) => props.theme.fontWeights.medium};
  font-size: ${(props) => props.theme.fontSizes.sm};
  padding: ${(props) => props.theme.space[2]}px;

  & span {
    width: 18px;
    height: 18px;
  }
`;

export const MenuButton = styled(Button)`
  ${menuStyle};
`;

export const MenuLink = styled(Link)`
  ${menuStyle};
  height: 48px;
  display: flex;
  align-items: center;

  & > svg {
    width: 18px;
    height: 18px;
    margin-right: ${(props) => props.theme.space[2]}px;
  }
`;

export const Menu = styled.div`
  width: 200px;
  background: ${(props) => props.theme.colors.bg};
  box-shadow: ${(props) => props.theme.shadows[1]};
  border-radius: ${(props) => props.theme.radii.medium}px;
  padding: ${(props) => props.theme.space[2]}px;
  z-index: ${(props) => props.theme.zIndex.front};
`;

export const Dropdown: React.FC<DropdownProps> = memo(function BaseDropdown({
  overlayStyle,
  ...props
}) {
  const theme = useTheme();
  return (
    <RcDropdown
      overlayStyle={{
        position: 'fixed',
        zIndex: theme.zIndex.dropDown,
        ...overlayStyle,
      }}
      {...props}
    />
  );
});
