import React, { useEffect } from 'react';
import { FeedItem, FeedItemMessage, ItemKind } from "~/state/ducks/feed/feedSlice";
import { useDispatch } from 'react-redux';
import { shortenUid } from '~/helpers';
import { lookupAndStoreUser } from '~/state/ducks/p2p/p2pSlice';
import { removeUser } from '~/state/ducks/users/usersSlice';
import { fromUnixTime } from 'date-fns';
import { formatTime } from '~/helpers/time';
import { Avatar, Root, Title, Text, Timestamp } from './styles';

type FeedItemBigImageProps = {
  item: FeedItem;
}

const FeedItemBigImage: React.FC<FeedItemBigImageProps> = ({ item }) => {
  switch (item.kind) {
    case ItemKind.MESSAGE:
      return (
        <Component
          bgImg={item.attachments && item.attachments[0].dataUrl}
          title={item.author.username || shortenUid(item.author.id)}
          avatar={item.author.avatarImage}
          text={item.text}
          timestamp={item.timestamp} />
      );
    case ItemKind.PLACE:
      return (
        <Component
          bgImg={item.avatarImage}
          title={item.name}
          text={item.description}
          timestamp={item.timestamp} />
      );
  }
}

type ComponentProps = {
  bgImg?: string;
  title: string;
  avatar?: string;
  text?: string;
  timestamp: number;
}

const Component: React.FC<ComponentProps> = ({ bgImg, title, avatar, text, timestamp }) => {
  const time = fromUnixTime(timestamp);
  return (
    <Root bgImg={bgImg || ""}>
      <Title>
        { avatar && (<Avatar src={avatar}></Avatar>) }
        { title }
        <Timestamp>
          {formatTime(time)}
        </Timestamp>
      </Title>
      <Text>
        { text }
      </Text>
    </Root>
  );
}

export default FeedItemBigImage;