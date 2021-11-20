import createEmojiRegex from 'emoji-regex';
import React from 'react';
import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';
import { UserMention } from '~/components/user-mention';
import { BotMention } from '~/components/user-mention/bot';
import { MessageContent, StickerItem } from '~/state/places/type';
import { isURLText } from '~/state/places/utils';
import { MessageTimestamp } from '../message-timestamp';

const emojiRegex = createEmojiRegex();

const Text = styled.div<{ mine: boolean }>`
  padding: ${(props) => `${props.theme.space[2]}px ${props.theme.space[3]}px`};
  border-radius: ${(props) =>
    props.mine
      ? `${props.theme.space[2]}px 0px ${props.theme.space[2]}px ${props.theme.space[2]}px`
      : `0 ${props.theme.space[2]}px ${props.theme.space[2]}px ${props.theme.space[2]}px`};
  font-weight: ${(props) => props.theme.fontWeights.normal};
  font-size: ${(props) => props.theme.fontSizes.md};
  color: ${(props) => props.theme.colors.primaryText};
  display: flex;
  flex-direction: column;
  background: ${(props) =>
    props.mine ? props.theme.colors.bgGray : props.theme.colors.bgBlue};
`;

const DecaMoji = styled.div<{ mine: boolean }>`
  font-size: ${(props) => props.theme.fontSizes['6xl']};
  text-align: center;
`;

const Link = styled.a`
  color: ${(props) => props.theme.colors.darkPrimary};
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

function isEmojiOnly(contents: MessageContent): boolean {
  if (contents.length !== 1) {
    return false;
  }

  const content = contents[0];

  return (
    typeof content === 'string' &&
    content.match(/./gu)?.length === 1 &&
    Boolean(content.match(emojiRegex))
  );
}

export const Message: React.FC<Props> = React.memo(function Message({
  mine,
  contents,
  timestamp,
  sticker,
  className,
}) {
  if (isEmojiOnly(contents)) {
    return (
      <Text mine={mine} className={className}>
        <DecaMoji mine={mine} data-testid="decamoji">
          {contents[0]}
        </DecaMoji>
        <MessageTimestamp timestamp={timestamp} />
      </Text>
    );
  }

  return (
    <Text mine={mine} className={className}>
      {sticker && <StickerView cid={sticker.cid} />}
      <div>
        {contents.map((content) => {
          if (typeof content === 'string') {
            return content;
          }

          if (isURLText(content)) {
            return (
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={content.value}
              >
                {content.value}
              </Link>
            );
          }

          return content.bot ? (
            <BotMention
              key={content.userId}
              userId={content.userId}
              name={content.name}
            />
          ) : (
            <UserMention
              key={content.userId}
              userId={content.userId}
              name={content.name}
            />
          );
        })}
      </div>
      <MessageTimestamp timestamp={timestamp} />
    </Text>
  );
});
