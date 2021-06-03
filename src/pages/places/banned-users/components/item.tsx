import React, { useCallback } from 'react';
import styled from 'styled-components';
import { IconButton } from '~/components/icon-button';
import { UserAvatar } from '~/components/user-avatar';
import { useAppSelector } from '~/hooks';
import { SvgTrash2 as TrashIcon } from '~/icons/Trash2';
import { selectUserById } from '~/state/users/usersSlice';

const Root = styled.li`
  height: 72px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray2};
  padding-bottom: ${(props) => props.theme.space[4]}px;
`;

const UserName = styled.span`
  display: flex;
  color: ${(props) => props.theme.colors.primaryText};
  font-size: ${(props) => props.theme.fontSizes.sm};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  align-items: center;
  margin-bottom: ${(props) => props.theme.space[1]}px;
`;

const RemoveButton = styled(IconButton)`
  height: 100%;
  color: ${(props) => props.theme.colors.red};
`;

const UserId = styled.span`
  color: ${(props) => props.theme.colors.secondaryText};
`;

interface Props {
  userId: string;
  onRemove: (userId: string) => void;
}

export const BannedUsersListItem: React.FC<Props> = React.memo(function Places({
  userId,
  onRemove,
}) {
  const user = useAppSelector((state) => selectUserById(state.users, userId));

  const handleRemove = useCallback(() => {
    onRemove(userId);
  }, [onRemove, userId]);

  if (!user) {
    return null;
  }

  return (
    <Root key={user.id}>
      <UserAvatar userId={user.id} size={54} />
      <div>
        <UserName>{user.username}</UserName>
        <UserId>#{user.id.slice(0, 6)}</UserId>
      </div>
      <RemoveButton
        data-userId={user.id}
        onClick={handleRemove}
        icon={<TrashIcon width={24} height={24} />}
      />
    </Root>
  );
});
