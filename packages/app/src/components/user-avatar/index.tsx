import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '~/hooks';
import { SvgDefaultUserAvatar as DefaultUserAvatarIcon } from '~/icons/DefaultUserAvatar';
import { selectUserById } from '~/state/users/usersSlice';

const UserImage = styled.img<{ size: number }>`
  display: inline-block;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: ${(props) => props.theme.radii.round};
`;

export interface UserAvatarProps {
  userId: string;
  size?: number;
}

export const UserAvatar: React.FC<UserAvatarProps> = React.memo(
  function UserAvatar({ userId, size = 28 }) {
    const user = useAppSelector((state) => selectUserById(state.users, userId));

    if (user?.avatarCid) {
      return (
        <UserImage src={`/view/${user.avatarCid}`} alt={userId} size={size} />
      );
    }

    return <DefaultUserAvatarIcon width={size} height={size} />;
  }
);
