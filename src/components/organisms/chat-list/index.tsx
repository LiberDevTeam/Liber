import React from 'react';
import styled from 'styled-components';
import { ChatItem, ChatListItem } from '~/components/molecules/chat-list-item';

export type ChatListProps = {
  chatList: ChatItem[];
};

const List = styled.div`
  flex: 1;
  margin-top: ${(props) => props.theme.space[8]}px;
  padding: ${(props) => props.theme.space[1]}px;
  overflow-y: scroll;

  & > div {
    margin-bottom: ${(props) => props.theme.space[4]}px;

    &:last-child {
      margin-bottom: 0px;
    }
  }
`;

export const ChatList: React.FC<ChatListProps> = React.memo(function ChatPage({
  chatList,
}) {
  return (
    <List>
      {chatList.map((chat) => (
        <ChatListItem key={`chat-${chat.id}`} chat={chat} />
      ))}
    </List>
  );
});
