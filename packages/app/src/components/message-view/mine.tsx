import React from 'react';
import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';
import { useAppSelector } from '~/hooks';
import { Loading } from '~/icons/loading';
import { selectMe } from '~/state/me/meSlice';
import {
  selectMessageById,
  selectMessageReactionsByMessage,
} from '~/state/places/messagesSlice';
import { NormalMessage } from '~/state/places/type';
import { Message } from '../message';
import { MessageTimestamp } from '../message-timestamp';
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

const Attachments = styled.div`
  display: flex;
  justify-content: flex-end;
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
