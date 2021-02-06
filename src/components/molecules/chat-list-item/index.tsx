import ColorHash from 'color-hash';
import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { selectChannelById } from '~/state/ducks/me/meSlice';

const activeClassName = 'selected-chat';
const colorHash = new ColorHash();

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
// TODO: use image
const Image = styled.div<{ color: string }>`
  width: 100%;
  height: 100%;
  background: ${(props) => props.color};
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
    const chat = useSelector(selectChannelById(chatId));

    if (!chat) {
      // TODO: Show error message
      return null;
    }

    return (
      <Root to={`/chats/${chatId}`} activeClassName={activeClassName}>
        <LeftContainer>
          <Image color={colorHash.hex(chatId)} />
          <Status />
        </LeftContainer>
        <RightContainer>
          <Title>{chat.name}</Title>
          <Description>{chat.description}</Description>
          <Time>{'2 hours ago'}</Time>
        </RightContainer>
      </Root>
    );
  }
);
