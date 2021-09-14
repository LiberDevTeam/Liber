import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '~/hooks';
import { selectBotById } from '~/state/bots/botsSlice';
import { Bot } from '~/state/bots/types';
import { selectMessageById } from '~/state/places/messagesSlice';
import { NormalMessage } from '~/state/places/type';
import { Message } from '../message';
import { Attachments } from './attachments';

const TextGroup = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const UserImage = styled.img<{ size: number }>`
  display: inline-block;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
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

const Body = styled.div`
  max-width: 80%;
  overflow-wrap: break-word;
  padding-left: ${(props) => props.theme.space[2]}px;
`;

export interface BotMessageViewProps {
  id: string;
}

export const BotMessageView: React.FC<BotMessageViewProps> = React.memo(
  function BotMessageView({ id }) {
    const message = useAppSelector((state) =>
      selectMessageById(state.placeMessages, id)
    ) as NormalMessage | undefined;

    const bot = useAppSelector<Bot | undefined>(selectBotById(message?.uid));

    if (!bot || !message) {
      return null;
    }

    return (
      <>
        <TextGroup>
          <div>
            <UserImage
              src={`/view/${bot.avatar}`}
              alt={message.uid}
              size={28}
            />
          </div>
          <Body>
            <UserName>{bot?.name || 'Loading'}</UserName>
            <Message
              mine={false}
              contents={message.content}
              timestamp={message.timestamp}
            />
          </Body>
        </TextGroup>
        <Attachments attachments={message.attachmentCidList} />
      </>
    );
  }
);
