import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const activeClassName = 'selected-chat';

const Root = styled(NavLink)`
  display: flex;
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

export interface ChatListItemProps {
  chatId: string;
}

export const ChatListItem: React.FC<ChatListItemProps> = React.memo(
  function ChatListItem({ chatId }) {
    // TODO: chatId chatの情報を取得する
    const title = 'We Love FC Barcelona!!';
    const description =
      'this is the last message someone saidasdjfl;askjd;flkajsd;flkjasd;lkfj;dlskaj';
    const time = '2 hours ago';

    return (
      <Root to={`/chats/${chatId}`} activeClassName={activeClassName}>
        <LeftContainer>
          <Image src="https://i.pravatar.cc/60" />
          <Status />
        </LeftContainer>
        <RightContainer>
          <Title>{title}</Title>
          <Description>{description}</Description>
          <Time>{time}</Time>
        </RightContainer>
      </Root>
    );
  }
);
