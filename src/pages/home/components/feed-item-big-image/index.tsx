import { fromUnixTime } from 'date-fns';
import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { shortenUid } from '~/helpers';
import { formatTime } from '~/helpers/time';
import { useAppSelector } from '~/hooks';
import { getIpfsNode } from '~/lib/ipfs';
import {
  downloadIpfsContent,
  selectIpfsContentByCid,
} from '~/state/p2p/ipfsContentsSlice';
import { Message, Place } from '~/state/places/type';
import { loadUser, selectUserById } from '~/state/users/usersSlice';
import {
  Avatar,
  Body,
  Content,
  Header,
  Root,
  Timestamp,
  Title,
} from './elements';

export const FeedItemMessageBigImage: React.FC<{ message: Message }> = memo(
  function FeedItemMessageBigImage({ message }) {
    const dispatch = useDispatch();
    const author = useAppSelector((state) =>
      message.uid ? selectUserById(state.users, message.uid) : undefined
    );

    useEffect(() => {
      dispatch(loadUser({ uid: message.uid }));
    }, [message.uid]);

    if (!author) {
      return <>loading...</>;
    }

    return (
      <Component
        bgCid={message.attachmentCidList?.[0] || ''}
        title={message.authorName || author.name || shortenUid(author)}
        avatarCid={author.avatarCid}
        text={message.text}
        timestamp={message.timestamp}
      />
    );
  }
);

export const FeedItemPlaceBigImage: React.FC<{ place: Place }> = memo(
  function MessageComponent({ place }) {
    return (
      <Component
        bgCid={place.avatarCid}
        title={place.name}
        text={place.description}
        timestamp={place.timestamp}
      />
    );
  }
);

interface ComponentProps {
  bgCid: string;
  title: string;
  avatarCid?: string;
  text?: string;
  timestamp: number;
}

const Component: React.FC<ComponentProps> = ({
  bgCid,
  title,
  avatarCid,
  text,
  timestamp,
}) => {
  const dispatch = useDispatch();
  const bgContent = useSelector(selectIpfsContentByCid(bgCid));

  useEffect(() => {
    (async () => {
      if (!bgContent) {
        await getIpfsNode();
        dispatch(downloadIpfsContent({ cid: bgCid }));
      }
    })();
  }, [dispatch, bgContent, bgCid]);

  const time = fromUnixTime(timestamp);
  return (
    <Root bgImg={bgContent?.dataUrl || ''}>
      <Content>
        <Header>
          {avatarCid && <Avatar cid={avatarCid}></Avatar>}
          <Title>{title}</Title>
          <Timestamp>- {formatTime(time)}</Timestamp>
        </Header>
        <Body>{text}</Body>
      </Content>
    </Root>
  );
};
