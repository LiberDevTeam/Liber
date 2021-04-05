import Dropdown from 'rc-dropdown';
import 'rc-dropdown/assets/index.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Button } from '~/components/button';
import { IconButton } from '~/components/iconButton';
import { SvgArrowIosBack as BackIcon } from '~/icons/ArrowIosBack';
import { SvgMoreVertical as MenuIcon } from '~/icons/MoreVertical';
import { SvgInfo as InfoIcon } from '~/icons/Info';
import { SvgPersonAdd as InviteIcon } from '~/icons/PersonAdd';
import { SvgLogOut as LeaveIcon } from '~/icons/LogOut';

const Root = styled.header`
  display: flex;
  align-items: center;
  position: relative;
`;
const BackLink = styled(Link)`
  width: 26px;
  height: 26px;
`;

const Avatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: ${(props) => props.theme.radii.round};
  margin-left: ${(props) => props.theme.space[2]}px;
`;

const TitleBox = styled.div`
  margin-left: ${(props) => props.theme.space[3]}px;
`;

const Title = styled.h2`
  flex: 1;
  color: ${(props) => props.theme.colors.primaryText};
  font-size: ${(props) => props.theme.fontSizes.lg};
  font-weight: ${(props) => props.theme.fontWeights.medium};
`;

const MemberCount = styled.span`
  color: ${(props) => props.theme.colors.secondaryText};
  font-size: ${(props) => props.theme.fontSizes.xs};
`;

const Actions = styled.div`
  position: absolute;
  right: 0px;

  & > * {
    margin-left: ${(props) => props.theme.space[4]}px;
  }
`;

const Menu = styled.div`
  width: 190px;
  background: ${(props) => props.theme.colors.bg};
  box-shadow: ${(props) => props.theme.shadows[1]};
  border-radius: ${(props) => props.theme.radii.medium}px;
  padding: ${(props) => props.theme.space[2]}px;
`;

const menuStyle = css`
  color: ${(props) => props.theme.colors.primaryText};
  width: 100%;
  justify-content: flex-start;
  font-weight: ${(props) => props.theme.fontWeights.medium};
  padding: ${(props) => props.theme.space[2]}px;
`;

const MenuButton = styled(Button)`
  ${menuStyle};
`;

const LeaveButton = styled(Button)`
  ${menuStyle};
  color: ${(props) => props.theme.colors.red};
`;

export interface PlaceDetailHeaderProps {
  name: string;
  avatar: string;
  memberCount: number;
  onInviteClick: () => void;
  onLeave: () => void;
}

export const PlaceDetailHeader: React.FC<PlaceDetailHeaderProps> = React.memo(
  function PlaceDetailHeader({
    name,
    avatar,
    memberCount,
    onInviteClick,
    onLeave,
  }) {
    const [openMenu, setOpenMenu] = useState(false);

    const handleInfoClick = () => {
      console.log('hello');
    };

    return (
      <Root>
        <BackLink to="/places">
          <BackIcon />
        </BackLink>
        <Avatar src={avatar} />
        <TitleBox>
          <Title>{name}</Title>
          <MemberCount>{memberCount} Members</MemberCount>
        </TitleBox>
        <Actions>
          <IconButton
            title="Open place info"
            onClick={handleInfoClick}
            icon={<InfoIcon width={24} height={24} />}
          />

          <Dropdown
            visible={openMenu}
            onVisibleChange={() => setOpenMenu(false)}
            overlay={() => (
              <Menu>
                <MenuButton
                  title="Invite people"
                  shape="square"
                  variant="text"
                  onClick={onInviteClick}
                  text="Invite People"
                  icon={<InviteIcon />}
                />
                <LeaveButton
                  shape="square"
                  variant="text"
                  text="Leave Place"
                  onClick={onLeave}
                  icon={<LeaveIcon />}
                />
              </Menu>
            )}
          >
            <IconButton
              icon={<MenuIcon width={24} height={24} />}
              title="Open menu"
              onClick={() => setOpenMenu(!openMenu)}
            />
          </Dropdown>
        </Actions>
      </Root>
    );
  }
);
