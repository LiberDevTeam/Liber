import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';
import { UserAvatar } from '~/components/user-avatar';
import { useAppSelector } from '~/hooks';
import { Loading } from '~/icons/loading';
import { selectMe } from '~/state/me/meSlice';
import { selectMessageById } from '~/state/places/messagesSlice';
import { setSelectedUser } from '~/state/selected-user';
import { Message } from '../message';
import { MessageTimestamp } from '../message-timestamp';

const Root = styled.div<{ mine: boolean }>`
  max-width: 80%;
  display: grid;
  grid-gap: ${(props) => props.theme.space[2]}px;
  grid-template-columns: ${(props) => (props.mine ? 'auto' : '28px auto')};
  align-self: ${(props) => (props.mine ? 'flex-end' : 'flex-start')};
`;

const StyledTimestamp = styled(MessageTimestamp)<{ mine: boolean }>`
  display: block;
  text-align: ${(props) => (props.mine ? 'right' : 'left')};
  padding-left: ${(props) => (props.mine ? 0 : props.theme.space[6])}px;
`;

const AvatarWrapper = styled.div`
  grid-column: 1;
  grid-row: 1 / 4;
`;

const AttachmentLoadingWrapper = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UserName = styled.span`
  display: flex;
  color: ${(props) => props.theme.colors.primaryText};
  font-size: ${(props) => props.theme.fontSizes.sm};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  height: ${(props) => props.theme.space[7]}px;
  align-items: center;
  padding-left: ${(props) => props.theme.space[1]}px;
`;

const Body = styled.div<{ mine: boolean }>`
  overflow-wrap: break-word;
  justify-self: ${(props) => (props.mine ? 'end' : 'start')};
`;

const Attachment = styled(IpfsContent)<{ mine: boolean }>`
  max-height: 100px;
  width: auto;
`;

const Attachments = styled.div<{ mine: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.mine ? 'flex-end' : 'flex-start')};
`;

const ReactionButtonWrapper = styled.div<{ mine: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.mine ? 'flex-start' : 'flex-end')};
`;

export interface MessageViewProps {
  id: string;
}

export const MessageView: React.FC<MessageViewProps> = React.memo(
  function MessageView({ id }) {
    const dispatch = useDispatch();
    const me = useAppSelector(selectMe);
    const message = useAppSelector((state) =>
      selectMessageById(state.placeMessages, id)
    );
    const mine = message?.uid === me.id;

    const handleClickUser = useCallback(() => {
      if (message?.uid && mine === false) {
        dispatch(setSelectedUser(message.uid));
      }
    }, [message?.uid, dispatch, mine]);

    if (!message) {
      return null;
    }

    const hasTextContent = message.content.length > 0;

    return (
      <Root mine={mine}>
        {mine ? null : (
          <>
            <AvatarWrapper onClick={handleClickUser}>
              <UserAvatar userId={message.uid} />
            </AvatarWrapper>
            <UserName>{message.authorName || 'Loading'}</UserName>
          </>
        )}
        <Body mine={mine}>
          {hasTextContent ? (
            <Message
              mine={mine}
              sticker={message.sticker}
              contents={message.content}
              timestamp={message.timestamp}
            />
          ) : null}
        </Body>
        <Attachments mine={mine}>
          {message.attachmentCidList &&
            message.attachmentCidList.map((cid) => (
              <Attachment
                key={`${id}-${cid}`}
                cid={cid}
                mine={mine}
                fallbackComponent={
                  <AttachmentLoadingWrapper>
                    <Loading width={56} height={56} />
                  </AttachmentLoadingWrapper>
                }
              />
            ))}
        </Attachments>
        <ReactionButtonWrapper mine={mine}></ReactionButtonWrapper>
        {hasTextContent ? null : (
          <StyledTimestamp timestamp={message.timestamp} mine={mine} />
        )}
      </Root>
    );
  }
);
