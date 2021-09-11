import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { BackLink } from '~/components/back-link';
import { CloseButton } from '~/components/close-button';
import { Dropdown, Menu, MenuButton, MenuLink } from '~/components/dropdown';
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
  z-index: ${(props) => props.theme.zIndex.front};
  position: fixed;
  width: 100%;
  top: 0;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  background: ${(props) => props.theme.colors.white};
  padding: ${(props) =>
    `${props.theme.space[5]}px 0 ${props.theme.space[2]}px`};
  border-bottom: ${(props) =>
    props.theme.border.bold(props.theme.colors.gray3)};
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

const Actions = styled.div`
  position: absolute;
  right: ${(props) => props.theme.space[1]}px;

  & > * {
    margin-left: ${(props) => props.theme.space[4]}px;
  }
`;

const LeaveButton = styled(MenuButton)`
  color: ${(props) => props.theme.colors.red};
`;

const PlaceInfo = styled.div`
  position: relative;
  background: white;
  margin: ${(props) => props.theme.space[2]}px;
  padding: ${(props) => props.theme.space[4]}px;
  border-radius: ${(props) => props.theme.radii.large}px;
  box-shadow: ${(props) => props.theme.shadows[2]};
`;

const PlaceInfoHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.space[4]}px;
`;

const Description = styled.div`
  margin: ${(props) => `0 ${props.theme.space[2]}px ${props.theme.space[2]}px`};
  color: ${(props) => props.theme.colors.secondaryText};
`;

const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  right: ${(props) => props.theme.space[2]}px;
  top: ${(props) => props.theme.space[2]}px;
`;

export interface PlaceDetailHeaderProps {
  placeId: string;
  address: string;
  name: string;
  avatarCid: string;
  description: string;
  onInviteClick: () => void;
  onLeave: () => void;
  onEditClick: () => void;
}

export const PlaceDetailHeader: React.FC<PlaceDetailHeaderProps> = React.memo(
  function PlaceDetailHeader({
    placeId,
    address,
    name,
    avatarCid,
    description,
    onInviteClick,
    onLeave,
    onEditClick,
  }) {
    const [openInfo, setOpenInfo] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const { t } = useTranslation('chat');

    return (
      <Root>
        <Container>
          <BackLink backTo="/places" />
          <Avatar cid={avatarCid} fallbackComponent={<AvatarPlaceholder />} />
          <TitleBox>
            <Title>{name}</Title>
          </TitleBox>
          <Actions>
            <IconButton
              title="Open place info"
              onClick={() => setOpenInfo(!openInfo)}
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
                    onClick={onEditClick}
                    text={t('Edit Chat')}
                    icon={<EditIcon />}
                  />
                  <MenuLink to={`/places/${address}/${placeId}/manage-bots`}>
                    <BotIcon />
                    {t('Manage Bots')}
                  </MenuLink>
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
        </Container>
        {openInfo && (
          <PlaceInfo>
            <StyledCloseButton onClick={() => setOpenInfo(false)} />
            <PlaceInfoHeader>
              <Avatar
                cid={avatarCid}
                fallbackComponent={<AvatarPlaceholder />}
              />
              <TitleBox>
                <Title>{name}</Title>
              </TitleBox>
            </PlaceInfoHeader>
            <Description>{description}</Description>
          </PlaceInfo>
        )}
      </Root>
    );
  }
);
