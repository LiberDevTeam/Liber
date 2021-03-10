import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Search as SearchIcon, Add as AddIcon } from '@material-ui/icons';
import { PlaceListColumnItem } from '~/components/molecules/place-list-item';
import { Input } from '~/components/atoms/input';
import { PageTitle } from '~/components/atoms/page-title';
import { Place } from '~/state/ducks/places/placesSlice';
import { push } from 'connected-react-router';
import { useDispatch } from 'react-redux';

export type PlaceListColumnProps = {
  title: string;
  placeList: Place[];
  onClickNew?: () => void;
};

const Header = styled.header`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  background: transparent;
  border: none;
`;

const SearchBox = styled.div`
  margin-top: ${(props) => props.theme.space[8]}px;
  padding: ${(props) => props.theme.space[1]}px;
  padding-right: ${(props) => props.theme.space[6]}px;
`;

const List = styled.div`
  flex: 1;
  margin-top: ${(props) => props.theme.space[8]}px;
  padding: ${(props) => props.theme.space[1]}px;
  overflow-y: auto;

  & > div {
    margin-bottom: ${(props) => props.theme.space[4]}px;

    &:last-child {
      margin-bottom: 0px;
    }
  }
`;

export const PlaceListColumn: React.FC<PlaceListColumnProps> = React.memo(
  function PlaceListColumn({ title, placeList }) {
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');

    const handleSearchTextChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.currentTarget.value);
      },
      []
    );

    const handleOnClickNew = () => {
      dispatch(push('/places/new'));
    };

    return (
      <>
        <Header>
          <PageTitle>{title}</PageTitle>
          <Button onClick={handleOnClickNew}>
            <AddIcon />
          </Button>
        </Header>
        <SearchBox>
          <Input
            icon={<SearchIcon />}
            value={searchText}
            onChange={handleSearchTextChange}
          />
        </SearchBox>
        <List>
          {placeList
            .filter((place) => place.name.includes(searchText))
            .map((place) => (
              <PlaceListColumnItem key={`place-${place.id}`} place={place} />
            ))}
        </List>
      </>
    );
  }
);
