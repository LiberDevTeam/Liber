import { useMediaQuery } from '@material-ui/core';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { theme } from '~/theme';
import { PlaceItem } from '~/components/molecules/place-list-item';
import { PlaceDetailColumn } from '~/components/organisms/place-detail-column';
import { PlaceListColumn } from '~/components/organisms/place-list-column';
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
    padding-left: ${(props) => props.theme.space[4]}px;
    border-left: 3px solid ${(props) => props.theme.colors.border};
  }
  &:last-child {
    flex-grow: 1;
  }
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
    [dispatch, pid, me.id]
  );

  const isMobile = useMediaQuery(`(max-width:${theme.breakpoints.sm})`);

  return (
    <BaseLayout>
      <Root>
        {!(isMobile && place) && (
          <ListContainer>
            <PlaceListColumn title={PAGE_TITLE} placeList={placeList} />
          </ListContainer>
        )}
        {place && (
          <ListContainer>
            <PlaceDetailColumn
              place={place}
              onSubmit={handleSubmit}
              messages={messages}
            />
          </ListContainer>
        )}
      </Root>
    </BaseLayout>
  );
});
