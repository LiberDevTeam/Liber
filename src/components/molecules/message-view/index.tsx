import React from 'react';
import styled from 'styled-components';
import { format, fromUnixTime, isToday } from 'date-fns';
import { Attachment } from '~/state/ducks/places/messagesSlice';

const Root = styled.div<{ mine: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.mine ? 'flex-end' : 'flex-start')};
`;

const UserImage = styled.img`
  width: ${(props) => props.theme.space[7]}px;
  height: ${(props) => props.theme.space[7]}px;
  border-radius: ${(props) => props.theme.radii.round};
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

const Timestamp = styled.span`
  font-size: ${(props) => props.theme.fontSizes.xs};
  line-height: ${(props) => props.theme.fontSizes['2xl']};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  color: ${(props) => props.theme.colors.secondaryText};
  margin-top: ${(props) => props.theme.space[2]}px;
`;

const Body = styled.div`
  padding-left: ${(props) => props.theme.space[2]}px;
`;

const Text = styled.div<{ mine: boolean }>`
  padding: ${(props) => `${props.theme.space[2]}px ${props.theme.space[3]}px`};
  border-radius: ${(props) =>
    props.mine
      ? `${props.theme.space[2]}px ${props.theme.space[2]}px 0px ${props.theme.space[2]}px`
      : `0 ${props.theme.space[2]}px ${props.theme.space[2]}px ${props.theme.space[2]}px`};
  font-weight: ${(props) => props.theme.fontWeights.normal};
  font-size: ${(props) => props.theme.fontSizes.md};
  line-height: ${(props) => props.theme.fontSizes['2xl']};
  color: ${(props) => props.theme.colors.primaryText};
  display: flex;
  flex-direction: column;
  background: ${(props) =>
    props.mine ? props.theme.colors.bgGray : props.theme.colors.bgBlue};
`;

const AttachmentContainer = styled.div`
  margin-top: ${(props) => props.theme.space[2]}px;
`;
const AttachmentImage = styled.img`
  max-height: 100px;
  width: auto;
`;

export interface MessageViewProps {
  name: string;
  timestamp: number;
  text?: string;
  attachments?: Attachment[];
  mine: boolean;
  userImage: string;
}

const TIME_STRICT_FORMAT = 'iiii, LLLL d, yyyy p';
const TODAY_TIME_FORMAT = 'p';
const DEFAULT_TIME_FORMAT = 'P';

export const MessageView: React.FC<MessageViewProps> = React.memo(
  function MessageView({
    name,
    timestamp,
    text,
    attachments,
    mine,
    userImage,
  }) {
    const time = fromUnixTime(timestamp);
    return (
      <Root mine={mine}>
        {mine ? null : (
          <div>
            <UserImage src={userImage} />
          </div>
        )}
        <Body>
          {mine ? null : <UserName>{name}</UserName>}
          <Text mine={mine}>
            {text}
            <Timestamp title={format(time, TIME_STRICT_FORMAT)}>
              {isToday(time)
                ? `Today at ${format(time, TODAY_TIME_FORMAT)}`
                : format(time, DEFAULT_TIME_FORMAT)}
            </Timestamp>
          </Text>
          {attachments
            ? attachments.map((image) => (
                <AttachmentContainer key={image.ipfsCid}>
                  <AttachmentImage src={image.dataUrl} />
                </AttachmentContainer>
              ))
            : null}
        </Body>
      </Root>
    );
  }
);
