import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Icon } from '~/icons';
import { SvgChevronRight as ChevronRightIcon } from '~/icons/ChevronRight';

export const Menu = styled.div`
  padding-top: ${(props) => props.theme.space[7]}px;
  display: flex;
  flex-direction: column;
`;

export const MenuTitle = styled.div`
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  font-size: ${(props) => props.theme.fontSizes.lg};
  padding-left: ${(props) => props.theme.space[6]}px;
  padding-bottom: ${(props) => props.theme.space[8]}px;
`;

const Item = styled(Link)`
  border-bottom: ${(props) => props.theme.border.gray2[1]};
  color: ${(props) => props.theme.colors.primaryText};
  padding: 0 ${(props) => props.theme.space[6]}px;
  padding-bottom: ${(props) => props.theme.space[4]}px;
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.space[4]}px;
  justify-content: space-between;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
`;

interface StyledIconProps {
  icon: Icon;
}

const StyledIcon: React.FC<StyledIconProps> = React.memo(function StyledIcon({
  icon,
}) {
  const Icon = styled(icon)`
    width: 48px;
    height: 48px;
    border-radius: ${(props) => props.theme.radii.round};
    background: ${(props) => props.theme.colors.bgGray};
    padding: ${(props) => props.theme.space[3]}px;
    margin-right: ${(props) => props.theme.space[3]}px;
  `;
  return <Icon />;
});

interface MenuItemProps {
  to: string;
  icon: Icon;
}

export const MenuItem: React.FC<MenuItemProps> = React.memo(function MenuItem({
  to,
  icon,
  children,
}) {
  return (
    <Item to={to}>
      <LeftGroup>
        <StyledIcon icon={icon} />
        {children}
      </LeftGroup>
      <ChevronRightIcon width={24} height={24} />
    </Item>
  );
});
