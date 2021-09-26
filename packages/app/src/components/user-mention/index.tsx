import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '~/hooks';
import { selectUserById } from '~/state/users/usersSlice';

const Root = styled.span`
  background: ${(props) => props.theme.colors.lightPrimary};
  color: ${(props) => props.theme.colors.invertedText};
  border-radius: ${(props) => props.theme.radii.small}px;
  padding: 1px 4px;
  margin-right: ${(props) => props.theme.space[1]}px;
`;

export const UserMention: React.FC<{ name: string; userId?: string }> =
  React.memo(function UserMention({ name, userId }) {
    const user = useAppSelector((state) =>
      userId ? selectUserById(state.users, userId) : undefined
    );

    if (!user) {
      return <span>@{name}</span>;
    }

    return <Root>@{user?.name || name}</Root>;
  });
