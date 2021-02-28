import React, { useCallback } from 'react';
import { useMediaQuery } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import { getUnixTime } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { theme } from '~/theme';
import { PlaceItem } from '~/components/molecules/place-list-item';
import { PlaceDetailColumn } from '~/components/organisms/place-detail-column';
import { PlaceListColumn } from '~/components/organisms/place-list-column';
import { selectMe } from '~/state/ducks/me/meSlice';
import { publishPlaceMessage } from '~/state/ducks/p2p/p2pSlice';
import { RootState } from '~/state/store';
import BaseLayout from '~/templates';
import {
  clearUnreadMessages,
  selectAllPlaces,
  selectPlaceById,
  selectPlaceMessagesByPID,
} from '~/state/ducks/places/placesSlice';
import {
  Message,
  selectMessageById,
} from '../../state/ducks/places/messagesSlice';

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
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const places = useSelector((state: RootState) => selectAllPlaces(state));

  const placeList: PlaceItem[] = places.map((place) => ({ ...place }));

  const place = useSelector(selectPlaceById(pid));
  const messages = useSelector(selectPlaceMessagesByPID(pid));
  const recentUnreadMessage = useSelector<RootState, Message | undefined>(
    (state) =>
      place?.unreadMessages
        ? selectMessageById(
            state.placeMessages,
            place.unreadMessages[place.unreadMessages.length - 1]
          )
        : undefined
  );

  const handleSubmit = useCallback(
    ({ text, file }: { text: string; file?: File }) => {
      const message = {
        id: uuidv4(),
        authorId: me.id,
        authorName: me.username,
        text,
        postedAt: getUnixTime(new Date()),
      };
      dispatch(publishPlaceMessage({ pid, message, file }));
    },
    [dispatch, pid, me.id, me.username]
  );
  const handleReachBottom = useCallback(() => {
    if (recentUnreadMessage) {
      dispatch(clearUnreadMessages(pid));
    }
  }, [dispatch, recentUnreadMessage, pid]);

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
              onReachBottom={handleReachBottom}
              myId={me.id}
              recentUnreadMessage={recentUnreadMessage}
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
