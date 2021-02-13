import { Search as SearchIcon } from '@material-ui/icons';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '~/components/atoms/input';
import { PageTitle } from '~/components/atoms/page-title';
import { PlaceItem } from '~/components/molecules/place-list-item';
import { PlaceDetail } from '~/components/organisms/place-detail';
import { PlaceList } from '~/components/organisms/place-list';
import { selectMe } from '~/state/ducks/me/meSlice';
import { publishMessage } from '~/state/ducks/p2p/p2pSlice';
import BaseLayout from '~/templates';
import {
  selectPlaceMessages,
  selectPlaces,
  selectPlaceById,
  MESSAGE_TYPE,
} from '../../state/ducks/place/placeSlice';

const PAGE_TITLE = 'Places';

const Root = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 360px auto;
  grid-gap: ${(props) => props.theme.space[8]}px;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 3px solid ${(props) => props.theme.colors.border};
  padding-right: ${(props) => props.theme.space[2]}px;
  overflow: hidden;
`;

const SearchBox = styled.div`
  margin-top: ${(props) => props.theme.space[8]}px;
  padding-right: ${(props) => props.theme.space[6]}px;
`;

export const Places: React.FC = React.memo(function Places() {
  const { pid } = useParams<{ pid: string }>();
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const places = useSelector(selectPlaces);
  const placeList: PlaceItem[] = Object.values(places).map((p) => ({
    ...p,
    title: p.name,
    avatarImage: `https://i.pravatar.cc/60?u=${p.id}`,
    timestamp: 1612708219995,
  }));
  const place = useSelector(selectPlaceById(pid));
  const messages = useSelector(selectPlaceMessages(pid));

  const handleSubmit = useCallback(
    (text: string) => {
      const message = {
        id: uuidv4(),
        type: MESSAGE_TYPE.Text,
        uid: me.id,
        text,
        timestamp: new Date().getTime(),
      };
      dispatch(publishMessage({ pid, message }));
    },
    [dispatch, places, pid]
  );

  return (
    <BaseLayout>
      <Root>
        <LeftContainer>
          <PageTitle>{PAGE_TITLE}</PageTitle>
          <SearchBox>
            <Input icon={<SearchIcon />} />
          </SearchBox>
          <PlaceList placeList={placeList} />
        </LeftContainer>
        {place && (
          <PlaceDetail
            place={place}
            onSubmit={handleSubmit}
            messages={messages}
          />
        )}
      </Root>
    </BaseLayout>
  );
});
