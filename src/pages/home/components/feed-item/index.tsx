import { fromUnixTime } from 'date-fns';
import React, { memo, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
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
  onRender: (clientHeight: number) => void;
}

export const FeedItemMessageDefault: React.FC<FeedItemMessageDefaultProps> =
  memo(function FeedItemMessageDefault({ message, onRender }) {
    const dispatch = useDispatch();
    const author = useAppSelector((state) =>
      message.uid ? selectUserById(state.users, message.uid) : undefined
    );

    useEffect(() => {
      dispatch(loadUser({ uid: message.uid }));
    }, [dispatch, message]);

    if (!author) {
      return <div>loading...</div>;
    }

    return (
      <Component
        id={message.id}
        attachmentCidList={message.attachmentCidList}
        title={message.authorName || author.name || shortenUid(author)}
        avatarCid={author.avatarCid}
        text={message.text}
        timestamp={message.timestamp}
        linkTo={`/places/${message.placeAddress}/${message.placeId}`}
        onRender={onRender}
      />
    );
  });

interface FeedItemPlaceDefaultProps {
  place: Place;
  onRender: (clientHeight: number) => void;
}

export const FeedItemPlaceDefault: React.FC<FeedItemPlaceDefaultProps> = memo(
  function FeedItemPlaceDefault({ place, onRender }) {
    return (
      <Component
        id={place.id}
        onRender={onRender}
        attachmentCidList={[place.avatarCid]}
        title={place.name}
        text={place.description}
        timestamp={place.timestamp}
        linkTo={`/places/${place.keyValAddress}/${place.id}`}
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
  linkTo: string;
  onRender: (clientHeight: number) => void;
}

const Component: React.FC<ComponentProps> = ({
  id,
  title,
  attachmentCidList,
  avatarCid,
  text,
  timestamp,
  linkTo,
  onRender,
}) => {
  const time = fromUnixTime(timestamp);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      onRender(ref.current.clientHeight);
    }
  }, [onRender, ref]);

  return (
    <Link to={linkTo}>
      <Root ref={ref}>
        <Header>
          <Title>
            {avatarCid && <Avatar src={`/view/${avatarCid}`}></Avatar>}
            {title}
          </Title>
          <Timestamp>{formatTime(time)}</Timestamp>
        </Header>
        <Text>{text}</Text>
        {attachmentCidList &&
          attachmentCidList.map((cid) => (
            <Attachment
              cid={cid}
              key={`${id}-${cid}`}
              onLoad={() => {
                if (ref.current) {
                  onRender(ref.current.clientHeight);
                }
              }}
            />
          ))}
      </Root>
    </Link>
  );
};
