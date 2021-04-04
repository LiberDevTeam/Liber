import React from 'react';
import styled from 'styled-components';
import { fromUnixTime } from 'date-fns';
import { formatTime, formatTimeStrict } from '~/helpers/time';
import { IpfsContent } from '../ipfsContent';

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
  max-height: 100px;
  width: auto;
`;

export interface MessageViewProps {
  name: string;
  timestamp: number;
  text?: string;
  attachmentCidList?: string[];
  mine: boolean;
  userImage: string;
}

export const MessageView: React.FC<MessageViewProps> = React.memo(
  function MessageView({
    name,
    timestamp,
    text,
    attachmentCidList,
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
            <Timestamp title={formatTimeStrict(time)}>
              {formatTime(time)}
            </Timestamp>
          </Text>
          {attachmentCidList
            ? attachmentCidList.map((cid) => (
                <AttachmentContainer key={cid}>
                  <IpfsContent cid={cid}/>
                </AttachmentContainer>
              ))
            : null}
        </Body>
      </Root>
    );
  }
);
