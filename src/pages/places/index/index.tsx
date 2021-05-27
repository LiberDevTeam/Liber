import { push } from 'connected-react-router';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { ChatListItem } from '~/components/chat-list-item';
import { IconButtonCircle } from '~/components/icon-button-circle';
import { Input } from '~/components/input';
import { SvgPlus as AddIcon } from '~/icons/Plus';
import { SvgSearch as SearchIcon } from '~/icons/Search';
import { selectAllPlaces } from '~/state/places/placesSlice';
import { RootState } from '~/state/store';
import BaseLayout from '~/templates';

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

export const Places: React.FC = React.memo(function Places() {
  const places = useSelector((state: RootState) => selectAllPlaces(state));
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
    <BaseLayout
      title="Chats"
      description="Messages with your friends"
      headerRightItem={
        <IconButtonCircle
          icon={<AddIcon width={24} height={24} />}
          onClick={handleOnClickNew}
        />
      }
    >
      <Root>
        <ListContainer>
          <Input
            icon={<SearchIcon width={24} height={24} />}
            value={searchText}
            onChange={handleSearchTextChange}
            placeholder="Search"
          />
          <List>
            {places
              .filter((place) => place.name.includes(searchText))
              .map((place) => (
                <ChatListItem key={`place-${place.id}`} place={place} />
              ))}
          </List>
        </ListContainer>
      </Root>
    </BaseLayout>
  );
});
