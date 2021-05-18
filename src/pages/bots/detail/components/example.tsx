import { getUnixTime } from 'date-fns';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';
import { Message } from '~/components/message';
import { selectBotById } from '~/state/ducks/bots/botsSlice';
import { selectMe } from '~/state/ducks/me/meSlice';

const Root = styled.div``;
const Avatar = styled(IpfsContent)``;
const BotName = styled.span`
  color: ${(props) => props.theme.colors.green};
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${(props) => props.theme.space[5]}px;
  & > * {
    margin-top: ${(props) => props.theme.space[5]}px;
  }
  border: ${(props) => props.theme.border.gray.thin};
  border-radius: ${(props) => props.theme.radii.large}px;
  margin-bottom: ${(props) => props.theme.space[6]}px;
`;

const MessageView = styled.div<{ mine: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.mine ? 'flex-end' : 'flex-start')};
`;

const Title = styled.div`
  color: ${(props) => props.theme.colors.secondaryText};
  margin: ${(props) => `${props.theme.space[2]}px 0 ${props.theme.space[3]}px`};
`;

const Right = styled.div`
  display: flex;
`;

const Left = styled.div`
  display: flex;
`;

interface ExampleProps {
  botId: string;
  index: number;
}

export const Example: React.FC<ExampleProps> = React.memo(function Example({
  botId,
  index,
}) {
  const bot = useSelector(selectBotById(botId));
  const me = useSelector(selectMe);
  const timestamp = getUnixTime(Date.now());

  if (!bot) return null;

  const example = bot.examples[index];

  return (
    <Root>
      <Title>{example.title}</Title>
      <Messages>
        <MessageView mine={true}>
          <div>
            <Right>
              You
              {me.avatarCid && <Avatar cid={me.avatarCid} />}
            </Right>
            <Message mine={true} text={example.input} timestamp={timestamp} />
          </div>
        </MessageView>

        <MessageView mine={false}>
          <div>
            <Left>
              <Avatar cid={bot.avatar} />
              <BotName>{bot.name}</BotName>
            </Left>
            <Message mine={false} text={example.output} timestamp={timestamp} />
          </div>
        </MessageView>
      </Messages>
    </Root>
  );
});
