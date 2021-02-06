import React from 'react';
import styled from 'styled-components';

const MessageHead = styled.div``;
const UserName = styled.span`
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
    return (
      <div>
        <MessageHead>
          <UserName>{uid}</UserName>
          <Timestamp>{timestamp}</Timestamp>
        </MessageHead>
        <Body>{text}</Body>
      </div>
    );
  }
);
