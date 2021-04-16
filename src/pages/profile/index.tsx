import { push } from 'connected-react-router';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IconButtonCircle } from '~/components/icon-button-circle';
import { shortenUid, username } from '~/helpers';
import { SvgEdit2 as EditIcon } from '~/icons/Edit2';
import { SvgSettings as SettingsIcon } from '~/icons/Settings';
import { SvgSmilingFace as SmilingFaceIcon } from '~/icons/SmilingFace';
import { selectMe } from '~/state/ducks/me/meSlice';
import { IpfsContent } from '../../components/ipfs-content';
import { SvgBot as BotIcon } from '../../icons/Bot';
import { SvgChevronRight as ChevronRightIcon } from '../../icons/ChevronRight';
import { SvgDefaultUserAvatar as DefaultUserAvatarIcon } from '../../icons/DefaultUserAvatar';
import BaseLayout from '../../templates';

const Header = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: ${(props) => props.theme.space[6]}px;
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

const Menu = styled.div`
  border-top: ${(props) => props.theme.border.grayLighter.light};
  padding-top: ${(props) => props.theme.space[7]}px;
  display: flex;
  flex-direction: column;
`;

const MenuTitle = styled.div`
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  font-size: ${(props) => props.theme.fontSizes.lg};
  padding-left: ${(props) => props.theme.space[8]}px;
  padding-bottom: ${(props) => props.theme.space[8]}px;
`;

const MenuItem = styled(Link)`
  border-bottom: ${(props) => props.theme.border.grayLighter.thin};
  text-decoration: none;
  color: ${(props) => props.theme.colors.primaryText};
  padding: 0 ${(props) => props.theme.space[7]}px;
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
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
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
        <MenuItem to="/bots">
          <LeftGroup>
            <StyledIcon icon={BotIcon} />
            Bots
          </LeftGroup>
          <ChevronRightIcon width={24} height={24} />
        </MenuItem>
        <MenuItem to="/stickers">
          <LeftGroup>
            <StyledIcon icon={SmilingFaceIcon} />
            Stickers
          </LeftGroup>
          <ChevronRightIcon width={24} height={24} />
        </MenuItem>
        <MenuItem to="/settings">
          <LeftGroup>
            <StyledIcon icon={SettingsIcon} />
            Settings
          </LeftGroup>
          <ChevronRightIcon width={24} height={24} />
        </MenuItem>
      </Menu>
    </BaseLayout>
  );
};
