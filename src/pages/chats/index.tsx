import { Search as SearchIcon } from '@material-ui/icons';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '~/components/atoms/input';
import { PageTitle } from '~/components/atoms/page-title';
import { ChatItem } from '~/components/molecules/chat-list-item';
import { ChatDetail } from '~/components/organisms/chat-detail';
import { ChatList } from '~/components/organisms/chat-list';
import BaseLayout from '~/templates';
import { broadcastMessage, rtcCreateOffer } from '../../connection/actions';
import { selectChannelMessages } from '../../state/ducks/channel/channelSlice';
import { selectChannelById, selectMe } from '../../state/ducks/me/meSlice';

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

export const Chats: React.FC = React.memo(function Chats() {
  const { cid } = useParams<{ cid: string }>();
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const chatList: ChatItem[] = Object.values(me.channels).map((c) => ({
    ...c,
    title: c.name,
    avatarImage: `https://i.pravatar.cc/60?u=${c.id}`,
    timestamp: 1612708219995,
  }));
  const chat = useSelector(selectChannelById(cid));
  const messages = useSelector(selectChannelMessages(cid));

  const handleSubmit = useCallback(
    (text: string) => {
      dispatch(
        broadcastMessage(cid, {
          id: uuidv4(),
          uid: me.id,
          text,
          timestamp: new Date().getTime(),
        })
      );
    },
    [dispatch, me, cid]
  );

  useEffect(() => {
    dispatch(rtcCreateOffer(cid, me));
  }, [dispatch, cid, me]);

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
        {chat && (
          <ChatDetail chat={chat} onSubmit={handleSubmit} messages={messages} />
        )}
      </Root>
    </BaseLayout>
  );
});
