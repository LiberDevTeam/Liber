import React from 'react';
import { PageTitle } from '~/components/atoms/page-title';
import styled from 'styled-components';
import { Input } from '~/components/atoms/input';
import { Search as SearchIcon } from '@material-ui/icons';
import { ChatListItem } from '~/components/molecules/chat-list-item';
import BaseLayout from '~/templates';
import { ChatDetail } from '~/components/organisms/chat-detail';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectMe } from '../../state/ducks/me/meSlice';

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
const ChatList = styled.div`
  flex: 1;
  margin-top: ${(props) => props.theme.space[8]}px;
  padding: ${(props) => props.theme.space[1]}px;
  overflow-y: auto;

  & > div {
    margin-bottom: ${(props) => props.theme.space[4]}px;

    &:last-child {
      margin-bottom: 0px;
    }
  }
`;

const SearchBox = styled.div`
  margin-top: ${(props) => props.theme.space[8]}px;
  padding-right: ${(props) => props.theme.space[6]}px;
`;

export const Chats: React.FC = React.memo(function Chats() {
  const { cid } = useParams<{ cid: string }>();
  const me = useSelector(selectMe);

  return (
    <BaseLayout>
      <Root>
        <LeftContainer>
          <PageTitle>{PAGE_TITLE}</PageTitle>
          <SearchBox>
            <Input icon={<SearchIcon />} />
          </SearchBox>
          <ChatList>
            {Object.keys(me.channels).map((id) => (
              <ChatListItem key={`chat-${id}`} chatId={`${id}`} />
            ))}
          </ChatList>
        </LeftContainer>
        {cid && <ChatDetail cid={cid} />}
      </Root>
    </BaseLayout>
  );
});
