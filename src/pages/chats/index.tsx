import React from 'react';
import { PageTitle } from '~/components/atoms/page-title';
import styled from 'styled-components';
import { Input } from '~/components/atoms/input';
import { Search as SearchIcon } from '@material-ui/icons';
import { ChatItem } from '~/components/molecules/chat-list-item';
import BaseLayout from '~/templates';
import { ChatDetail } from '~/components/organisms/chat-detail';
import { useParams } from 'react-router-dom';
import { ChatList } from '~/components/organisms/chat-list';
import { add, getUnixTime, sub } from 'date-fns';

const PAGE_TITLE = 'Chats';

const Root = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 360px auto;
  grid-gap: ${(props) => props.theme.space[8]}px;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 3px solid ${(props) => props.theme.colors.border};
  padding-right: ${(props) => props.theme.space[2]}px;
  overflow: hidden;
`;

const SearchBox = styled.div`
  margin-top: ${(props) => props.theme.space[8]}px;
  padding-right: ${(props) => props.theme.space[6]}px;
`;

// TODO: chatId chatの情報を取得する
const chatList: ChatItem[] = [...Array(50)].map((_, index) => {
  const id = String(index);
  const yesterday = sub(new Date(), { days: 1 });
  const time = add(yesterday, { hours: index });
  return {
    id,
    title: 'We Love FC Barcelona!!',
    avatarImage: `https://i.pravatar.cc/60?u=${id}`,
    description:
      'this is the last message someone saidasdjfl;askjd;flkajsd;flkjasd;lkfj;dlskaj',
    timestamp: getUnixTime(time),
  };
});

export const Chats: React.FC = React.memo(function Chats() {
  const { cid } = useParams<{ cid: string }>();
  return (
    <BaseLayout>
      <Root>
        <LeftContainer>
          <PageTitle>{PAGE_TITLE}</PageTitle>
          <SearchBox>
            <Input icon={<SearchIcon />} />
          </SearchBox>
          <ChatList chatList={chatList} />
        </LeftContainer>
        {cid && <ChatDetail cid={cid} />}
      </Root>
    </BaseLayout>
  );
});
