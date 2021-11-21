import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ManageBots } from '~/components/manage-bots';
import BaseLayout from '~/templates';

export const ManageBotsPage: React.FC = React.memo(function ManageBotsPage() {
  const { t } = useTranslation('chat');
  const { placeId, address } = useParams();

  return (
    <BaseLayout
      title={t('Manage Bots')}
      description={t('Manage your banned user list')}
      backTo={`/places/${address}/${placeId}`}
    >
      {placeId ? <ManageBots placeId={placeId} /> : null}
    </BaseLayout>
  );
});
