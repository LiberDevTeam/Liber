import { fromUnixTime } from 'date-fns';
import React, { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { shortenUid } from '~/helpers';
import { formatTime } from '~/helpers/time';
import { useAppSelector } from '~/hooks';
import { Message, Place } from '~/state/places/type';
import { loadUser, selectUserById } from '~/state/users/usersSlice';
import {
  Attachment,
  Avatar,
  Header,
  Root,
  Text,
  Timestamp,
  Title,
} from './elements';

interface FeedItemMessageDefaultProps {
  message: Message;
}

export const FeedItemMessageDefault: React.FC<FeedItemMessageDefaultProps> =
  memo(function FeedItemMessageDefault({ message }) {
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
        id={message.id}
        attachmentCidList={message.attachmentCidList}
        title={message.authorName || author.name || shortenUid(author)}
        avatarCid={author.avatarCid}
        text={message.text}
        timestamp={message.timestamp}
      />
    );
  });

interface FeedItemPlaceDefaultProps {
  place: Place;
}

export const FeedItemPlaceDefault: React.FC<FeedItemPlaceDefaultProps> = memo(
  function FeedItemPlaceDefault({ place }) {
    return (
      <Component
        id={place.id}
        attachmentCidList={[place.avatarCid]}
        title={place.name}
        text={place.description}
        timestamp={place.timestamp}
      />
    );
  }
);

interface ComponentProps {
  id: string;
  title: string;
  attachmentCidList?: string[];
  avatarCid?: string;
  text?: string;
  timestamp: number;
}

const Component: React.FC<ComponentProps> = ({
  id,
  title,
  attachmentCidList,
  avatarCid,
  text,
  timestamp,
}) => {
  const time = fromUnixTime(timestamp);
  return (
    <Root>
      <Header>
        <Title>
          {avatarCid && <Avatar cid={avatarCid}></Avatar>}
          {title}
        </Title>
        <Timestamp>{formatTime(time)}</Timestamp>
      </Header>
      <Text>{text}</Text>
      {attachmentCidList &&
        attachmentCidList.map((cid) => (
          <Attachment cid={cid} key={`${id}-${cid}`} />
        ))}
    </Root>
  );
};
