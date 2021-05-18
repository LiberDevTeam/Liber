import { getUnixTime } from 'date-fns';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';
import { Message } from '~/components/message';
import { selectBotById } from '~/state/ducks/bots/botsSlice';
import { selectMe } from '~/state/ducks/me/meSlice';

const Root = styled.div``;
const Avatar = styled(IpfsContent)<{ mine: boolean }>`
  height: 36px;
  width: 36px;
  border-radius: ${(props) => props.theme.radii.round};
  ${(props) =>
    `${props.mine ? 'margin-left' : 'margin-right'}: ${
      props.theme.space[2]
    }px;`}
`;
const BotName = styled.span`
  color: ${(props) => props.theme.colors.green};
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${(props) => `${props.theme.space[5]}px ${props.theme.space[3]}px`};
  & > * {
    margin-top: ${(props) => props.theme.space[5]}px;
  }
  border: ${(props) => props.theme.border.gray.thin};
  border-radius: ${(props) => props.theme.radii.large}px;
  margin-bottom: ${(props) => props.theme.space[6]}px;
`;

const StyledMessage = styled(Message)`
  margin: 0 ${(props) => props.theme.space[10]}px;
`;

const MessageView = styled.div<{ mine: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.mine ? 'flex-end' : 'flex-start')};
`;

const Title = styled.div`
  color: ${(props) => props.theme.colors.secondaryText};
  margin: ${(props) => `${props.theme.space[2]}px 0 ${props.theme.space[3]}px`};
`;

const MessageHeader = styled.div<{ mine: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.mine ? 'flex-end' : 'flex-start')};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  margin-bottom: ${(props) => props.theme.space[1]}px;
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
            <MessageHeader mine={true}>
              You
              {me.avatarCid && <Avatar mine={true} cid={me.avatarCid} />}
            </MessageHeader>
            <StyledMessage
              mine={true}
              text={example.input}
              timestamp={timestamp}
            />
          </div>
        </MessageView>

        <MessageView mine={false}>
          <div>
            <MessageHeader mine={false}>
              <Avatar mine={false} cid={bot.avatar} />
              <BotName>{bot.name}</BotName>
            </MessageHeader>
            <StyledMessage
              mine={false}
              text={example.output}
              timestamp={timestamp}
            />
          </div>
        </MessageView>
      </Messages>
    </Root>
  );
});
