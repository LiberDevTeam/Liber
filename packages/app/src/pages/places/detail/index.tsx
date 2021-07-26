import Observer from '@researchgate/react-intersection-observer';
import { immutable as arrayUniq } from 'array-unique';
import 'emoji-mart/css/emoji-mart.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { MessageView } from '~/components/message-view';
import { BotMessageView } from '~/components/message-view/bot';
import { PasswordDialog } from '~/components/password-dialog';
import { SharePlaceDialog } from '~/components/share-place-dialog';
import { UnreadToast } from '~/components/unread-toast';
import { UserMenu } from '~/components/user-menu';
import { invitationUrl, omitText } from '~/helpers';
import { history } from '~/history';
import { LoadingPage } from '~/pages/loading';
import { MessageInput } from '~/pages/places/detail/components/message-input';
import { appendJoinedPlace } from '~/state/me/meSlice';
import { connectToMessages } from '~/state/places/async-actions';
import {
  banUser,
  clearUnreadMessages,
  joinPlace,
  removePlace,
  selectPlaceById,
  selectPlaceMessagesByPlaceId,
} from '~/state/places/placesSlice';
import { loadUsers } from '~/state/users/usersSlice';
import BaseLayout from '~/templates';
import { PlaceDetailHeader } from './components/place-detail-header';

const Root = styled.div`
  padding: ${(props) =>
    `${props.theme.space[14]}px 0 ${props.theme.space[22]}px`};
`;

const ToastWrapper = styled.div`
  position: absolute;
  display: block;
  text-align: center;
  top: -60px;
  left: 0;
  right: 0;
  margin-bottom: ${(props) => props.theme.space[6]}px;
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: ${(props) =>
    `0 ${props.theme.space[3]}px 0 ${props.theme.space[2]}px`};
  & > * {
    margin-top: ${(props) => props.theme.space[3]}px;
  }
`;

const Footer = styled.footer`
  position: fixed;
  background: ${(props) => props.theme.colors.white};
  right: 0;
  left: 0;
  bottom: 0;
  padding: ${(props) =>
    `${props.theme.space[2]}px 0 ${props.theme.space[5]}px`};
  border-top: ${(props) => props.theme.border.bold(props.theme.colors.gray3)};
`;

export interface FormValues {
  text: string;
}

export const ChatDetail: React.FC = React.memo(function ChatDetail() {
  const { placeId, address } = useParams<{
    placeId: string;
    address: string;
  }>();
  const place = useSelector(selectPlaceById(placeId));
  const messages = useSelector(selectPlaceMessagesByPlaceId(placeId));
  const userIds = arrayUniq(messages.map((m) => m.uid));

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const messagesBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pk = { placeId, address };
    dispatch(joinPlace(pk));
    dispatch(appendJoinedPlace(pk));
  }, [dispatch, placeId, address]);

  useEffect(() => {
    dispatch(
      loadUsers({
        userIds,
      })
    );
  }, [dispatch, JSON.stringify(userIds)]);

  // Scroll to bottom when open chat or added new messages
  useEffect(() => {
    messagesBottomRef.current?.scrollIntoView();
  }, [placeId, messages.length]);

  useEffect(() => {
    if (place?.feedAddress) {
      dispatch(
        connectToMessages({
          placeId,
          address: place.feedAddress,
          hash: place.hash,
        })
      );
    }
  }, [dispatch, place?.feedAddress, placeId, place?.hash]);

  const handleIntersection = useCallback(
    (e) => {
      if (e.isIntersecting && place?.unreadMessages) {
        dispatch(clearUnreadMessages(placeId));
      }
    },
    [dispatch, place?.unreadMessages, placeId]
  );

  const handleBanUser = useCallback(
    (userId: string) => {
      if (place?.id) {
        dispatch(banUser({ userId, placeId: place.id }));
      }
    },
    [dispatch, place?.id]
  );

  const handleClearUnread = useCallback(() => {
    if (place?.unreadMessages) {
      dispatch(clearUnreadMessages(placeId));
    }
  }, [dispatch, place?.unreadMessages, placeId]);

  if (!place) {
    return <LoadingPage text="Connecting to place..." />;
  }

  return (
    <>
      <BaseLayout>
        <Root>
          <PlaceDetailHeader
            placeId={place.id}
            address={place.keyValAddress}
            name={omitText(place.name, 20)}
            avatarCid={place.avatarCid}
            onInviteClick={() => {
              setOpen(true);
            }}
            memberCount={23}
            description={place.description}
            onLeave={() => {
              dispatch(removePlace({ placeId: place.id }));
              history.push('/places');
            }}
            onEditClick={() => {
              history.push(`/places/${place.keyValAddress}/${place.id}/edit`);
            }}
          />

          {place.passwordRequired && place.hash === undefined && (
            <PasswordDialog
              placeId={place.id}
              onClose={() => {
                dispatch(removePlace({ placeId: place.id }));
                history.push('/places');
              }}
            />
          )}

          <Messages>
            {messages.map((m) =>
              m.bot ? (
                <BotMessageView id={m.id} key={m.id} />
              ) : (
                <MessageView id={m.id} key={m.id} />
              )
            )}
            <Observer onChange={handleIntersection}>
              <div ref={messagesBottomRef} />
            </Observer>
          </Messages>

          {/* <StickerPanel placeId={placeId} /> */}

          <Footer>
            {place.unreadMessages?.length > 0 ? (
              <ToastWrapper>
                <UnreadToast
                  messageCount={place.unreadMessages.length}
                  onClose={handleClearUnread}
                  onClick={() => {
                    messagesBottomRef.current?.scrollIntoView();
                  }}
                />
              </ToastWrapper>
            ) : null}
            <MessageInput placeId={placeId} />
          </Footer>
        </Root>
      </BaseLayout>
      <SharePlaceDialog
        open={open}
        url={invitationUrl(place.id, place.keyValAddress)}
        onClose={() => setOpen(false)}
      />
      <UserMenu onBan={handleBanUser} />
    </>
  );
});
