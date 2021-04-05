import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Add as AddIcon } from '@material-ui/icons';
import { ChatListItem } from '~/components/ChatListItem';
import { Input } from '~/components/input';
import { PageTitle } from '~/components/pageTitle';
import { Place } from '~/state/ducks/places/placesSlice';
import { push } from 'connected-react-router';
import { useDispatch } from 'react-redux';
import { SvgSearch as SearchIcon } from '~/icons/Search';

export interface PlaceListColumnProps {
  title: string;
  placeList: Place[];
  onClickNew?: () => void;
}

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
            icon={<SearchIcon width={24} height={24} />}
            value={searchText}
            onChange={handleSearchTextChange}
            placeholder="Search"
          />
        </SearchBox>
        <List>
          {placeList
            .filter((place) => place.name.includes(searchText))
            .map((place) => (
              <ChatListItem key={`place-${place.id}`} place={place} />
            ))}
        </List>
      </>
    );
  }
);
