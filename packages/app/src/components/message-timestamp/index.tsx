import { fromUnixTime } from 'date-fns';
import React from 'react';
import styled from 'styled-components';
import { formatTime, formatTimeStrict } from '~/helpers/time';

const Root = styled.span`
  font-size: ${(props) => props.theme.fontSizes.xs};
  line-height: ${(props) => props.theme.fontSizes['2xl']};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  color: ${(props) => props.theme.colors.secondaryText};
  margin-top: ${(props) => props.theme.space[2]}px;
`;

interface Props {
  timestamp: number;
  className?: string;
}

export const MessageTimestamp: React.FC<Props> = ({ timestamp, className }) => {
  const time = fromUnixTime(timestamp);
  return (
    <Root title={formatTimeStrict(time)} className={className}>
      {formatTime(time)}
    </Root>
  );
};
