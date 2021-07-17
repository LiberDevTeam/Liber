import React from 'react';
import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';
import { UserMention } from '~/components/user-mention';
import { BotMention } from '~/components/user-mention/bot';
import { MessageContent, StickerItem } from '~/state/places/type';
import { MessageTimestamp } from '../message-timestamp';

const Text = styled.div<{ mine: boolean }>`
  padding: ${(props) => `${props.theme.space[2]}px ${props.theme.space[3]}px`};
  border-radius: ${(props) =>
    props.mine
      ? `${props.theme.space[2]}px 0px ${props.theme.space[2]}px ${props.theme.space[2]}px`
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

const StickerView = styled(IpfsContent)`
  width: 100%;
  max-height: 200px;
  object-fit: contain;
`;

interface Props {
  mine: boolean;
  contents: MessageContent;
  timestamp: number;
  className?: string;
  sticker?: StickerItem;
}

export const Message: React.FC<Props> = React.memo(function Message({
  mine,
  contents,
  timestamp,
  sticker,
  className,
}) {
  return (
    <Text mine={mine} className={className}>
      {sticker && <StickerView cid={sticker.cid} />}
      <div>
        {contents.map((value) => {
          if (typeof value === 'string') {
            return value;
          }

          return value.bot ? (
            <BotMention
              key={value.userId}
              userId={value.userId}
              name={value.name}
            />
          ) : (
            <UserMention
              key={value.userId}
              userId={value.userId}
              name={value.name}
            />
          );
        })}
      </div>
      <MessageTimestamp timestamp={timestamp} />
    </Text>
  );
});
