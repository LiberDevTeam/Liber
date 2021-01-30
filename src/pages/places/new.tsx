import React from 'react';
import { PageTitle } from '~/components/page-title';
import styled from 'styled-components';

const PAGE_TITLE = 'Create new place';

const Description = styled.p`
  font-size: ${(props) => props.theme.fontSizes.lg};
  font-weight: ${(props) => props.theme.fontWeights.normal};
  margin-top: ${(props) => props.theme.space[7]}px;
`;

export const NewPlace: React.FC = React.memo(function NewPlace() {
  return (
    <div>
      <PageTitle>{PAGE_TITLE}</PageTitle>
      <Description>Please fill out a form and submit it.</Description>
    </div>
  );
});
