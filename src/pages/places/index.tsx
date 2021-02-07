import { Search as SearchIcon } from '@material-ui/icons';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '~/components/atoms/input';
import { PageTitle } from '~/components/atoms/page-title';
import { PlaceItem } from '~/components/molecules/place-list-item';
import { PlaceDetail } from '~/components/organisms/place-detail';
import { PlaceList } from '~/components/organisms/place-list';
import BaseLayout from '~/templates';
import { selectPlaceMessages } from '../../state/ducks/place/placeSlice';
import { selectPlaceById, selectMe } from '../../state/ducks/me/meSlice';

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
  const { cid } = useParams<{ cid: string }>();
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const placeList: PlaceItem[] = Object.values(me.places).map((c) => ({
    ...c,
    title: c.name,
    avatarImage: `https://i.pravatar.cc/60?u=${c.id}`,
    timestamp: 1612708219995,
  }));
  const place = useSelector(selectPlaceById(cid));
  const messages = useSelector(selectPlaceMessages(cid));

  const handleSubmit = useCallback(
    (text: string) => {
      // dispatch(
      //   broadcastMessage(cid, {
      //     id: uuidv4(),
      //     uid: me.id,
      //     text,
      //     timestamp: new Date().getTime(),
      //   })
      // );
    },
    [dispatch, me, cid]
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
