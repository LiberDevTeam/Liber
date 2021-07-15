import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

const Root = styled.div``;
const StyledTimestamp = styled(MessageTimestamp)<{ mine: boolean }>`
  display: block;
  text-align: ${(props) => (props.mine ? 'right' : 'left')};
  padding-left: ${(props) => (props.mine ? 0 : props.theme.space[6])}px;
`;

const TextGroup = styled.div<{ mine: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.mine ? 'flex-end' : 'flex-start')};
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
  margin-bottom: ${(props) => props.theme.space[2]}px;
`;

const Body = styled.div`
  max-width: 80%;
  overflow-wrap: break-word;
  padding-left: ${(props) => props.theme.space[2]}px;
`;

const Attachment = styled(IpfsContent)<{ mine: boolean }>`
  max-height: 100px;
  width: auto;
`;

const Attachments = styled.div<{ mine: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.mine ? 'flex-end' : 'flex-start')};
  margin-left: ${(props) => props.theme.space[6]}px;
`;

export interface MessageViewProps {
  id: string;
}

export const MessageView: React.FC<MessageViewProps> = React.memo(
  function MessageView({ id }) {
    const dispatch = useDispatch();
    const me = useSelector(selectMe);
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
      <Root>
        <TextGroup mine={mine}>
          <div onClick={handleClickUser}>
            <UserAvatar userId={message.uid} />
          </div>
          <Body>
            {mine ? null : (
              <UserName>{message.authorName || 'Loading'}</UserName>
            )}
            {hasTextContent ? (
              <Message
                mine={mine}
                sticker={message.sticker}
                contents={message.content}
                timestamp={message.timestamp}
              />
            ) : null}
          </Body>
        </TextGroup>
        {message.attachmentCidList && message.attachmentCidList.length > 0 ? (
          <Attachments mine={mine}>
            {message.attachmentCidList.map((cid) => (
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
        ) : null}
        {hasTextContent ? null : (
          <StyledTimestamp timestamp={message.timestamp} mine={mine} />
        )}
      </Root>
    );
  }
);
