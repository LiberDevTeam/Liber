import { formatDistanceToNowStrict, fromUnixTime } from 'date-fns';
import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const activeClassName = 'selected-chat';

const Root = styled(NavLink)`
  display: inline-flex;
  width: 100%;
  padding: ${(props) => props.theme.space[1]}px;
  border-radius: ${(props) => props.theme.radii.medium}px;
  border: 2px solid white;
  text-decoration: none;

  &.${activeClassName} {
    background: ${(props) => props.theme.colors.bg2};
    border: 2px solid ${(props) => props.theme.colors.primary};
  }

  &:hover {
    cursor: pointer;
    background: ${(props) => props.theme.colors.bg2};
  }
`;

const LeftContainer = styled.div`
  width: 60px;
  height: 60px;
  min-width: 60px;
  position: relative;
  padding: ${(props) => props.theme.space[1]}px;
`;
const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: ${(props) => props.theme.radii.medium}px;
`;
const Status = styled.div`
  width: 12px;
  height: 12px;
  position: absolute;
  top: 0px;
  right: 0px;
  background: ${(props) => props.theme.colors.green};
  border-radius: ${(props) => props.theme.radii.round};
`;

const RightContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: ${(props) => props.theme.space[4]}px;
  overflow: hidden;
`;
const Title = styled.div`
  color: ${(props) => props.theme.colors.primaryText};
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: ${(props) => props.theme.fontWeights.medium};
`;
const Description = styled.div`
  color: ${(props) => props.theme.colors.secondaryText};
  font-size: ${(props) => props.theme.fontSizes.sm};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const Time = styled.div`
  color: ${(props) => props.theme.colors.secondaryText};
  font-size: ${(props) => props.theme.fontSizes.sm};
  font-weight: ${(props) => props.theme.fontWeights.semibold};
`;

export type ChatItem = {
  id: string;
  title: string;
  avatarImage: string;
  description: string;
  timestamp: number;
};

export interface ChatListItemProps {
  chat: ChatItem;
}

export const ChatListItem: React.FC<ChatListItemProps> = React.memo(
  function ChatListItem({ chat }) {
    const dispTime = useMemo(() => {
      const date = fromUnixTime(chat.timestamp);
      return formatDistanceToNowStrict(date, { addSuffix: true });
    }, [chat.timestamp]);

    return (
      <Root to={`/chats/${chat.id}`} activeClassName={activeClassName}>
        <LeftContainer>
          <Image src={chat.avatarImage} />
          <Status />
        </LeftContainer>
        <RightContainer>
          <Title>{chat.title}</Title>
          <Description>{chat.description}</Description>
          <Time>{dispTime}</Time>
        </RightContainer>
      </Root>
    );
  }
);
