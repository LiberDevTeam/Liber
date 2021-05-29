import Dropdown from 'rc-dropdown';
import 'rc-dropdown/assets/index.css';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { BackLink } from '~/components/back-link';
import { Button } from '~/components/button';
import { IconButton } from '~/components/icon-button';
import { IpfsContent } from '~/components/ipfs-content';
import { SvgBot as BotIcon } from '~/icons/Bot';
import { SvgEdit2 as EditIcon } from '~/icons/Edit2';
import { SvgInfo as InfoIcon } from '~/icons/Info';
import { SvgLogOut as LeaveIcon } from '~/icons/LogOut';
import { SvgMoreVertical as MenuIcon } from '~/icons/MoreVertical';
import { SvgPeople as PeopleIcon } from '~/icons/People';
import { SvgPersonAdd as InviteIcon } from '~/icons/PersonAdd';

const Root = styled.header`
  display: flex;
  align-items: center;
  position: fixed;
  width: 100%;
  background: ${(props) => props.theme.colors.white};
  padding: ${(props) =>
    `${props.theme.space[12]}px 0 ${props.theme.space[2]}px`};
  top: 0;
  border-bottom: ${(props) => props.theme.border.grayLight.light};
`;

const Avatar = styled(IpfsContent)`
  display: inline-block;
  width: 56px;
  height: 56px;
  border-radius: ${(props) => props.theme.radii.round};
  margin-left: ${(props) => props.theme.space[2]}px;
`;

const AvatarPlaceholder = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${(props) => props.theme.radii.round};
  background: ${(props) => props.theme.colors.bgGray};
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
  right: ${(props) => props.theme.space[1]}px;

  & > * {
    margin-left: ${(props) => props.theme.space[4]}px;
  }
`;

const Menu = styled.div`
  width: 200px;
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
  font-size: ${(props) => props.theme.fontSizes.sm};
  padding: ${(props) => props.theme.space[2]}px;

  & span {
    width: 18px;
    height: 18px;
  }
`;

const MenuButton = styled(Button)`
  ${menuStyle};
`;

const MenuLink = styled(Link)`
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

const LeaveButton = styled(Button)`
  ${menuStyle};
  color: ${(props) => props.theme.colors.red};
`;

export interface PlaceDetailHeaderProps {
  placeId: string;
  address: string;
  name: string;
  avatarCid: string;
  memberCount: number;
  onInviteClick: () => void;
  onLeave: () => void;
}

export const PlaceDetailHeader: React.FC<PlaceDetailHeaderProps> = React.memo(
  function PlaceDetailHeader({
    placeId,
    address,
    name,
    avatarCid,
    memberCount,
    onInviteClick,
    onLeave,
  }) {
    const [openMenu, setOpenMenu] = useState(false);
    const { t } = useTranslation('chat');

    const handleInfoClick = () => {
      console.log('hello');
    };

    return (
      <Root>
        <BackLink backTo="/places" />
        <Avatar cid={avatarCid} fallbackComponent={<AvatarPlaceholder />} />
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
            onOverlayClick={() => setOpenMenu(false)}
            overlay={() => (
              <Menu>
                <MenuButton
                  title={t('Invite People')}
                  shape="square"
                  variant="text"
                  onClick={onInviteClick}
                  text={t('Invite People')}
                  icon={<InviteIcon />}
                />
                <MenuButton
                  title={t('Edit Chat')}
                  shape="square"
                  variant="text"
                  onClick={onInviteClick}
                  text={t('Edit Chat')}
                  icon={<EditIcon />}
                />
                <MenuButton
                  title={t('Manage Bots')}
                  shape="square"
                  variant="text"
                  onClick={onInviteClick}
                  text={t('Manage Bots')}
                  icon={<BotIcon />}
                />
                <MenuButton
                  title={t('Manage Maintainers')}
                  shape="square"
                  variant="text"
                  onClick={onInviteClick}
                  text={t('Manage Maintainers')}
                  icon={<PeopleIcon />}
                />
                <MenuLink to={`/places/${address}/${placeId}/banned-users`}>
                  <PeopleIcon />
                  {t('Banned Users')}
                </MenuLink>
                <LeaveButton
                  title={t('Leave Chat')}
                  shape="square"
                  variant="text"
                  text={t('Leave Chat')}
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
