import React from 'react';
import styled from 'styled-components';
import { format, fromUnixTime } from 'date-fns';
import ColorHash from 'color-hash';
import { hex } from 'wcag-contrast';

const colorHash = new ColorHash();

const MessageHead = styled.div``;

interface UserNameProps {
  color: string;
  background: string | undefined;
}
const UserName = styled.span<UserNameProps>`
  color: ${(props) => props.color};
  background: ${(props) => props.background};
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: ${(props) => props.theme.fontWeights.medium};
`;
const Timestamp = styled.span`
  font-size: ${(props) => props.theme.fontSizes.xs};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  color: ${(props) => props.theme.colors.secondaryText};
  margin-left: ${(props) => props.theme.space[3]}px;
`;

const Body = styled.div`
  font-size: ${(props) => props.theme.fontSizes.xs};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  color: ${(props) => props.theme.colors.primaryText};
  margin-top: ${(props) => props.theme.space[1]}px;
`;

export interface MessageViewProps {
  uid: string;
  timestamp: number;
  text: string;
}

export const MessageView: React.FC<MessageViewProps> = React.memo(
  function MessageView({ uid, timestamp, text }) {
    const name = uid.split('-')[0];
    const color = colorHash.hex(name);
    return (
      <div>
        <MessageHead>
          <UserName
            color={color}
            background={hex('#fff', color) < 2.2 ? '#333' : undefined}
          >
            {name}
          </UserName>
          <Timestamp>
            {format(
              fromUnixTime(Math.round(timestamp / 1000)),
              'yyyy-MM-dd HH:mm:ss'
            )}
          </Timestamp>
        </MessageHead>
        <Body>{text}</Body>
      </div>
    );
  }
);
