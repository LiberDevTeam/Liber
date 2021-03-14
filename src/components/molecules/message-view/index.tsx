import React from 'react';
import styled from 'styled-components';
import { format, fromUnixTime, isToday } from 'date-fns';
import ColorHash from 'color-hash';
import { hex } from 'wcag-contrast';
import { Attachment } from '~/state/ducks/places/messagesSlice';

const colorHash = new ColorHash();

const MessageHead = styled.div``;

interface UserNameProps {
  color: string;
  background: string | undefined;
}
const UserName = styled.span<UserNameProps>`
  color: ${(props) => props.color};
  background: ${(props) => props.background};
  font-size: ${(props) => props.theme.fontSizes.sm};
  font-weight: ${(props) => props.theme.fontWeights.medium};
`;
const Timestamp = styled.span`
  font-size: ${(props) => props.theme.fontSizes.xs};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  color: ${(props) => props.theme.colors.secondaryText};
  margin-left: ${(props) => props.theme.space[3]}px;
`;

const Body = styled.div`
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: ${(props) => props.theme.fontWeights.normal};
  color: ${(props) => props.theme.colors.primaryText};
  margin-top: ${(props) => props.theme.space[1]}px;
  display: flex;
  flex-direction: column;
`;

const AttachmentContainer = styled.div``;
const AttachmentImage = styled.img`
  max-height: 100px;
  width: auto;
`;

export interface MessageViewProps {
  authorId: string;
  timestamp: number;
  text?: string;
  attachments?: Attachment[];
}

const TIME_STRICT_FORMAT = 'iiii, LLLL d, yyyy p';
const TODAY_TIME_FORMAT = 'p';
const DEFAULT_TIME_FORMAT = 'P';

export const MessageView: React.FC<MessageViewProps> = React.memo(
  function MessageView({ authorId, timestamp, text, attachments }) {
    const name = authorId.split('-')[0];
    const color = colorHash.hex(name);
    const time = fromUnixTime(timestamp);
    return (
      <div>
        <MessageHead>
          <UserName
            color={color}
            background={hex('#fff', color) < 2.2 ? '#333' : undefined}
          >
            {name}
          </UserName>
          <Timestamp title={format(time, TIME_STRICT_FORMAT)}>
            {isToday(time)
              ? `Today at ${format(time, TODAY_TIME_FORMAT)}`
              : format(time, DEFAULT_TIME_FORMAT)}
          </Timestamp>
        </MessageHead>
        <Body>
          {text}
          {attachments
            ? attachments.map((a) => (
                <AttachmentContainer key={a.ipfsCid}>
                  <AttachmentImage src={a.dataUrl} />
                </AttachmentContainer>
              ))
            : null}
        </Body>
      </div>
    );
  }
);
