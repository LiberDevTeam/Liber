import React from 'react';
import styled from 'styled-components';
import {
  PlaceItem,
  PlaceListItem,
} from '~/components/molecules/place-list-item';

export type PlaceListProps = {
  placeList: PlaceItem[];
};

const List = styled.div`
  flex: 1;
  margin-top: ${(props) => props.theme.space[8]}px;
  padding: ${(props) => props.theme.space[1]}px;
  overflow-y: scroll;

  & > div {
    margin-bottom: ${(props) => props.theme.space[4]}px;

    &:last-child {
      margin-bottom: 0px;
    }
  }
`;

export const PlaceList: React.FC<PlaceListProps> = React.memo(
  function PlaceList({ placeList }) {
    return (
      <List>
        {placeList.map((place) => (
          <PlaceListItem key={`place-${place.id}`} place={place} />
        ))}
      </List>
    );
  }
);
