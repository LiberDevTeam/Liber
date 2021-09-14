import React from 'react';
import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';
import { useAppSelector } from '~/hooks';
import { selectMe } from '~/state/me/meSlice';
import {
  selectMessageById,
  selectMessageReactionsByMessage,
} from '~/state/places/messagesSlice';
import { NormalMessage } from '~/state/places/type';
import { Message } from '../message';
import { MessageTimestamp } from '../message-timestamp';
import { Attachments } from './attachments';
import { Reactions } from './reactions';
import { MessageViewProps } from './type';

const Root = styled.div`
  max-width: 80%;
  display: grid;
  grid-gap: ${(props) => props.theme.space[2]}px;
  grid-template-columns: auto;
  align-self: flex-end;
`;

const StyledTimestamp = styled(MessageTimestamp)`
  display: block;
  text-align: right;
`;

const AttachmentLoadingWrapper = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Body = styled.div`
  overflow-wrap: break-word;
  justify-self: end;
`;

const Attachment = styled(IpfsContent)`
  max-height: 100px;
`;

const StyledReactions = styled(Reactions)`
  justify-self: flex-end;
`;

export const MyMessageView: React.FC<MessageViewProps> = ({
  id,
  onReactionClick,
}) => {
  const message = useAppSelector((state) =>
    selectMessageById(state.placeMessages, id)
  ) as NormalMessage | undefined;
  const me = useAppSelector(selectMe);
  const reactions = useAppSelector(selectMessageReactionsByMessage(message));

  if (!message) {
    return null;
  }

  const hasTextContent = message.content.length > 0;

  return (
    <Root>
      <Body>
        {hasTextContent ? (
          <Message
            mine
            sticker={message.sticker}
            contents={message.content}
            timestamp={message.timestamp}
          />
        ) : null}
      </Body>
      <Attachments attachments={message.attachmentCidList} />
      {hasTextContent ? null : (
        <StyledTimestamp timestamp={message.timestamp} />
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
