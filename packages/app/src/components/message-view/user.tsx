import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { UserAvatar } from '~/components/user-avatar';
import { useAppSelector } from '~/hooks';
import { selectMe } from '~/state/me/meSlice';
import {
  selectMessageById,
  selectMessageReactionsByMessage,
} from '~/state/places/messagesSlice';
import { NormalMessage } from '~/state/places/type';
import { setSelectedUser } from '~/state/selected-user';
import { Message } from '../message';
import { MessageTimestamp } from '../message-timestamp';
import { Attachments } from './attachments';
import { Reactions } from './reactions';
import { MessageViewProps } from './type';

const Root = styled.div`
  max-width: 80%;
  display: grid;
  grid-gap: ${(props) => props.theme.space[2]}px;
  grid-template-columns: 28px auto;
  align-self: flex-start;
`;

const StyledTimestamp = styled(MessageTimestamp)`
  display: block;
  text-align: left;
`;

const AvatarWrapper = styled.div`
  grid-column: 1;
  grid-row: 1 / 4;
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

const Body = styled.div`
  overflow-wrap: break-word;
  justify-self: start;
`;

const StyledReactions = styled(Reactions)`
  grid-column-start: 2;
`;

export const UserMessageView: React.FC<MessageViewProps> = ({
  id,
  onReactionClick,
}) => {
  const dispatch = useDispatch();
  const me = useAppSelector(selectMe);
  const message = useAppSelector((state) =>
    selectMessageById(state.placeMessages, id)
  ) as NormalMessage | undefined;
  const reactions = useAppSelector(selectMessageReactionsByMessage(message));

  const handleClickUser = useCallback(() => {
    if (message?.uid) {
      dispatch(setSelectedUser(message.uid));
    }
  }, [message?.uid, dispatch]);

  if (!message) {
    return null;
  }

  const hasTextContent = message.content.length > 0;

  return (
    <Root>
      <AvatarWrapper onClick={handleClickUser}>
        <UserAvatar userId={message.uid} />
      </AvatarWrapper>
      <UserName>{message.authorName || 'Loading'}</UserName>
      <Body>
        {hasTextContent ? (
          <Message
            mine={false}
            sticker={message.sticker}
            contents={message.content}
            timestamp={message.timestamp}
          />
        ) : null}
      </Body>
      <Attachments attachments={message.attachmentCidList} />

      {hasTextContent ? null : (
        <>
          <div />
          <StyledTimestamp timestamp={message.timestamp} />
        </>
      )}
      <StyledReactions
        id={message.id}
        myId={me.id}
        onClick={onReactionClick}
        reactions={reactions}
      />
    </Root>
  );
};
