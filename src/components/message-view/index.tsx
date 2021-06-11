import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';
import { UserAvatar } from '~/components/user-avatar';
import { UserMention } from '~/components/user-mention';
import { useAppSelector } from '~/hooks';
import { selectMe } from '~/state/me/meSlice';
import { selectMessageById } from '~/state/places/messagesSlice';
import { setSelectedUser } from '~/state/selected-user';
import { Message } from '../message';

const TextGroup = styled.div<{ mine: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.mine ? 'flex-end' : 'flex-start')};
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
  uid: string;
  timestamp: number;
  text?: string;
  attachmentCidList?: string[];
  mine: boolean;
}

export const MessageView: React.FC<MessageViewProps> = React.memo(
  function MessageView({ id, uid, timestamp, text, attachmentCidList, mine }) {
    const dispatch = useDispatch();
    const me = useSelector(selectMe);
    const message = useAppSelector((state) =>
      selectMessageById(state.placeMessages, id)
    );

    const handleClickUser = useCallback(() => {
      if (message?.uid && me.id !== message.uid) {
        dispatch(setSelectedUser(message.uid));
      }
    }, [message?.uid, dispatch]);

    if (!message) {
      return null;
    }

    return (
      <>
        <TextGroup mine={mine}>
          <div onClick={handleClickUser}>
            <UserAvatar userId={message.uid} />
          </div>
          <Body>
            {mine ? null : (
              <UserName>{message.authorName || 'Loading'}</UserName>
            )}

            <Message
              mine={mine}
              contents={message.content.map((value) => {
                if (typeof value === 'string') {
                  return value;
                }

                return (
                  <UserMention
                    key={value.userId}
                    userId={value.userId}
                    name={value.name}
                  />
                );
              })}
              timestamp={timestamp}
            />
          </Body>
        </TextGroup>
        {attachmentCidList && attachmentCidList.length > 0 ? (
          <Attachments mine={mine}>
            {attachmentCidList.map((cid) => (
              <Attachment key={`${id}-${cid}`} cid={cid} mine={mine} />
            ))}
          </Attachments>
        ) : null}
      </>
    );
  }
);
