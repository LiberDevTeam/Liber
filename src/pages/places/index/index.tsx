import { useMediaQuery } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { PlaceDetailColumn } from '~/components/placeDetailColumn';
import { PlaceListColumn } from '~/components/placeListColumn';
import {
  selectAllPlaces,
  selectPlaceById,
} from '~/state/ducks/places/placesSlice';
import { RootState } from '~/state/store';
import BaseLayout from '~/templates';

const PAGE_TITLE = 'Places';

const Root = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: ${(props) => props.theme.breakpoints.xs};
  margin: ${(props) => props.theme.space[2]}px;
  overflow: hidden;
  & + * {
    border-left: 3px solid ${(props) => props.theme.colors.border};
  }
  &:last-child {
    flex-grow: 1;
  }
`;

export const Places: React.FC = React.memo(function Places() {
  const { pid } = useParams<{ pid: string }>();
  const places = useSelector((state: RootState) => selectAllPlaces(state));
  const place = useSelector(selectPlaceById(pid));

  return (
    <BaseLayout>
      <Root>
        <ListContainer>
          {place ? (
            <PlaceDetailColumn place={place} />
          ) : (
            <PlaceListColumn title={PAGE_TITLE} placeList={places} />
          )}
        </ListContainer>
      </Root>
    </BaseLayout>
  );
});
