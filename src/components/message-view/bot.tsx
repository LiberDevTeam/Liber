import React from 'react';
import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';
import { useAppSelector } from '~/hooks';
import { Bot } from '~/state/bots/botsSlice';
import { selectPurchasedBotById } from '~/state/mypage/botsSlice';
import { Message } from '../message';

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

const Attachment = styled(IpfsContent)`
  max-height: 100px;
  width: auto;
`;

const Attachments = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-left: ${(props) => props.theme.space[6]}px;
`;

export interface BotMessageViewProps {
  id: string;
  uid: string;
  timestamp: number;
  avatarCid: string;
  text?: string;
  attachmentCidList?: string[];
}

export const BotMessageView: React.FC<BotMessageViewProps> = React.memo(
  function BotMessageView({ id, uid, timestamp, text, attachmentCidList }) {
    const bot = useAppSelector<Bot | undefined>(selectPurchasedBotById(uid));

    if (!bot) {
      return null;
    }

    return (
      <>
        {text && (
          <TextGroup>
            <div>
              <UserImage src={`/view/${bot.avatar}`} alt={uid} size={28} />
            </div>
            <Body>
              <UserName>{bot?.name || 'Loading'}</UserName>
              <Message mine={false} text={text} timestamp={timestamp} />
            </Body>
          </TextGroup>
        )}
        {attachmentCidList && attachmentCidList.length > 0 ? (
          <Attachments>
            {attachmentCidList.map((cid) => (
              <Attachment key={`${id}-${cid}`} cid={cid} />
            ))}
          </Attachments>
        ) : null}
      </>
    );
  }
);
