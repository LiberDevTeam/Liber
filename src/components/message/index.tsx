import { fromUnixTime } from 'date-fns';
import React from 'react';
import styled from 'styled-components';
import { formatTime, formatTimeStrict } from '~/helpers/time';

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

const Timestamp = styled.span`
  font-size: ${(props) => props.theme.fontSizes.xs};
  line-height: ${(props) => props.theme.fontSizes['2xl']};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  color: ${(props) => props.theme.colors.secondaryText};
  margin-top: ${(props) => props.theme.space[2]}px;
`;

interface Props {
  mine: boolean;
  text: string;
  timestamp: number;
}

export const Message: React.FC<Props> = React.memo(function Message({
  mine,
  text,
  timestamp,
}) {
  const time = fromUnixTime(timestamp);
  return (
    <Text mine={mine}>
      {text}
      <Timestamp title={formatTimeStrict(time)}>{formatTime(time)}</Timestamp>
    </Text>
  );
});
