import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';
import { UserAvatar } from '~/components/user-avatar';
import { useAppSelector } from '~/hooks';
import { Loading } from '~/icons/loading';
import { selectMe } from '~/state/me/meSlice';
import {
  selectMessageById,
  selectMessageReactionsByMessage,
} from '~/state/places/messagesSlice';
import { NormalMessage } from '~/state/places/type';
import { setSelectedUser } from '~/state/selected-user';
import { Message } from '../message';
import { MessageTimestamp } from '../message-timestamp';
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

const Body = styled.div`
  overflow-wrap: break-word;
  justify-self: start;
`;

const Attachment = styled(IpfsContent)`
  max-height: 100px;
  width: auto;
`;

const Attachments = styled.div`
  display: flex;
  justify-content: flex-start;
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
      {message.attachmentCidList && message.attachmentCidList.length > 0 ? (
        <Attachments>
          {message.attachmentCidList.map((cid) => (
            <Attachment
              key={`${id}-${cid}`}
              cid={cid}
              fallbackComponent={
                <AttachmentLoadingWrapper>
                  <Loading width={56} height={56} />
                </AttachmentLoadingWrapper>
              }
            />
          ))}
        </Attachments>
      ) : null}

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
