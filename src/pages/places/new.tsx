import React from 'react';
import { PageTitle } from '../../components/page-title';

const PAGE_TITLE = 'Create new place';

export const NewPlace: React.FC = React.memo(function NewPlace() {
  return (
    <div>
      <PageTitle>{PAGE_TITLE}</PageTitle>
    </div>
  );
});
