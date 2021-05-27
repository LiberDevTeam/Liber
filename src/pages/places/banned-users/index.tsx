import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAppSelector } from '~/hooks';
import { selectPlaceById, unbanUser } from '~/state/places/placesSlice';
import { loadUsers } from '~/state/users/usersSlice';
import BaseLayout from '~/templates';
import { BannedUsersListItem } from './components/item';

const List = styled.ul`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0 ${(props) => props.theme.space[5]}px;
  margin-top: 0;
`;

export const BannedUsers: React.FC = React.memo(function Places() {
  const { t } = useTranslation('chat');
  const { pid } = useParams<{ pid: string }>();
  const userIds = useAppSelector((state) => {
    const place = selectPlaceById(pid)(state);
    return place ? place.bannedUsers : [];
  });
  const dispatch = useDispatch();

  const handleRemoveUser = useCallback(
    (userId: string) => {
      dispatch(unbanUser({ placeId: pid, userId }));
    },
    [dispatch, pid]
  );

  useEffect(() => {
    dispatch(
      loadUsers({
        userIds,
      })
    );
  }, [dispatch, JSON.stringify(userIds)]);

  return (
    <BaseLayout
      title={t('Banned Users')}
      description={t('Manage your banned user list')}
      backTo={`/places/${pid}`}
    >
      <List>
        {userIds.map((userId) => (
          <BannedUsersListItem
            key={userId}
            userId={userId}
            onRemove={handleRemoveUser}
          />
        ))}
      </List>
    </BaseLayout>
  );
});
