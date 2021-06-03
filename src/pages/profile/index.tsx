import { push } from 'connected-react-router';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { IconButtonCircle } from '~/components/icon-button-circle';
import { Menu, MenuItem, MenuTitle } from '~/components/icon-menu';
import { IpfsContent } from '~/components/ipfs-content';
import { shortenUid, username } from '~/helpers';
import { SvgBot as BotIcon } from '~/icons/Bot';
import { SvgDefaultUserAvatar as DefaultUserAvatarIcon } from '~/icons/DefaultUserAvatar';
import { SvgEdit2 as EditIcon } from '~/icons/Edit2';
import { SvgSettings as SettingsIcon } from '~/icons/Settings';
import { SvgSmilingFace as SmilingFaceIcon } from '~/icons/SmilingFace';
import { selectMe } from '~/state/me/meSlice';
import BaseLayout from '~/templates';

const Header = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-bottom: ${(props) => props.theme.space[6]}px;
  border-bottom: ${(props) => props.theme.border.gray2[2]};
`;

const Avatar = styled(IpfsContent)`
  border-radius: ${(props) => props.theme.radii.round};
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const AvatarContainer = styled.div`
  width: 140px;
  height: 140px;
  box-shadow: ${(props) => props.theme.shadows[1]};
  border-radius: ${(props) => props.theme.radii.round};
  margin-bottom: ${(props) => props.theme.space[6]}px;
`;

const Username = styled.div`
  text-align: center;
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  font-size: ${(props) => props.theme.fontSizes['2xl']};
  margin-bottom: ${(props) => props.theme.space[2]}px;
`;

const ID = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-weight: ${(props) => props.theme.fontWeights.normal};
  font-size: ${(props) => props.theme.fontSizes.md};
  text-align: center;
  margin-bottom: ${(props) => props.theme.space[2]}px;
`;

export const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);

  const handleClickEdit = useCallback(() => {
    dispatch(push('/profile/edit'));
  }, []);

  return (
    <BaseLayout
      headerRightItem={
        <IconButtonCircle
          icon={<EditIcon width={24} height={24} />}
          onClick={handleClickEdit}
        />
      }
    >
      <Header>
        <AvatarContainer>
          {me.avatarCid ? (
            <Avatar cid={me.avatarCid} />
          ) : (
            <DefaultUserAvatarIcon />
          )}
        </AvatarContainer>
        <Username>{username(me)}</Username>
        <ID>#{shortenUid(me)}</ID>
      </Header>
      <Menu>
        <MenuTitle>Others</MenuTitle>
        <MenuItem to="/bots" icon={BotIcon}>
          Bots
        </MenuItem>
        <MenuItem to="/stickers" icon={SmilingFaceIcon}>
          Stickers
        </MenuItem>
        <MenuItem to="/settings" icon={SettingsIcon}>
          Settings
        </MenuItem>
      </Menu>
    </BaseLayout>
  );
};
