import copy from 'copy-to-clipboard';
import { lighten } from 'polished';
import React, { MouseEvent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '~/hooks';
import { SvgCopy as CopyIcon } from '~/icons/Copy';
import { PersonBlock } from '~/icons/PersonBlock';
import { SvgSlash as BanIcon } from '~/icons/Slash';
import { clearSelectedUser } from '~/state/selected-user';
import { selectUserById } from '~/state/users/usersSlice';
import { theme } from '~/theme';
import { UserAvatar } from '../user-avatar';

export interface UserMenuProps {
  onBan: (userId: string) => void;
}

const Handle = styled.div`
  width: 50px;
  height: 3px;
  background: ${(props) => props.theme.colors.primaryText};
  border-radius: ${(props) => props.theme.radii.large};
  margin: auto;
  opacity: 0.15;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray2};
  padding-bottom: ${(props) => props.theme.space[4]}px;
  margin-top: ${(props) => props.theme.space[10]}px;
`;

const UserName = styled.span`
  display: flex;
  color: ${(props) => props.theme.colors.primaryText};
  font-size: ${(props) => props.theme.fontSizes.sm};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  align-items: center;
  margin-bottom: ${(props) => props.theme.space[1]}px;
`;

const UserId = styled.span`
  color: ${(props) => props.theme.colors.secondaryText};
`;

const CopyButton = styled.button`
  display: inline-flex;
  width: 54px;
  height: 54px;
  justify-content: center;
  justify-self: right;
  align-items: center;
  background-color: ${(props) => props.theme.colors.bgPrimary};
  color: ${(props) => props.theme.colors.primary};
  border-radius: ${(props) => props.theme.radii.round};
  border: none;

  &:hover {
    color: ${(props) => props.theme.colors.white};
    background-color: ${(props) => lighten(0.1, props.theme.colors.primary)};
  }

  &:active {
    color: ${(props) => props.theme.colors.white};
    background-color: ${(props) => lighten(0.2, props.theme.colors.primary)};
  }

  &:disabled {
    color: ${(props) => props.theme.colors.white};
    background-color: ${(props) => props.theme.colors.disabled};
  }

  & > svg {
    transform: rotate(90deg);
  }
`;

const Menu = styled.ul`
  display: grid;
  grid-gap: ${(props) => props.theme.space[2]}px;
`;

const MenuItem = styled.button`
  width: 100%;
  text-align: left;
  display: grid;
  grid-gap: ${(props) => props.theme.space[3]}px;
  color: ${(props) => props.theme.colors.red};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  align-items: center;
  grid-template-columns: 28px 1fr;
  background: none;
  border: none;
  padding: ${(props) => props.theme.space[3]}px 0;
`;

const modalStyle = {
  overlay: { backgroundColor: theme.colors.modalBg },
  content: {
    inset: 'auto auto 0px auto',
    borderRadius: `${theme.radii.large}px ${theme.radii.large}px 0 0`,
    padding: theme.space[6],
    border: 'none',
    width: '100%',
  },
};

const MenuKeys = {
  BLOCK: 'BLOCK',
  BAN: 'BAN',
};

export const UserMenu: React.FC<UserMenuProps> = React.memo(function UserMenu({
  onBan,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation('chat');
  const selectedUserId = useAppSelector((state) => state.selectedUser);
  const user = useAppSelector((state) =>
    selectedUserId ? selectUserById(state.users, selectedUserId) : undefined
  );

  const handleIdCopy = useCallback(() => {
    if (user) {
      copy(user.id);
    }
  }, [user]);

  const handleCloseRequest = useCallback(() => {
    dispatch(clearSelectedUser());
  }, [dispatch]);

  const handleMenuClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (!user) {
        return;
      }

      switch (e.currentTarget.dataset.menuKey) {
        case MenuKeys.BLOCK:
          // TODO: implement
          break;
        case MenuKeys.BAN:
          onBan(user.id);
          break;
      }
      dispatch(clearSelectedUser());
    },
    [onBan, user, dispatch]
  );

  if (!selectedUserId) {
    return null;
  }

  return (
    <ReactModal isOpen onRequestClose={handleCloseRequest} style={modalStyle}>
      <Handle />
      <Header>
        <UserAvatar userId={selectedUserId} size={54} />
        <div>
          <UserName>{user ? user.name : 'Loading'}</UserName>
          <UserId>#{selectedUserId.slice(0, 6)}</UserId>
        </div>
        <CopyButton
          type="button"
          onClick={handleIdCopy}
          title="Copy Link"
          color={theme.colors.primary}
        >
          <CopyIcon width={24} height={24} />
        </CopyButton>
      </Header>
      <Menu>
        <li>
          <MenuItem data-menu-key={MenuKeys.BLOCK} onClick={handleMenuClick}>
            <PersonBlock width={28} height={28} />
            {t('Block')}
          </MenuItem>
        </li>
        <li>
          <MenuItem data-menu-key={MenuKeys.BAN} onClick={handleMenuClick}>
            <BanIcon width={28} height={28} />
            {t('Ban')}
          </MenuItem>
        </li>
      </Menu>
    </ReactModal>
  );
});
