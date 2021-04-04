import React from 'react';
import { FeedItem, ItemKind } from "~/state/ducks/feed/feedSlice";
import { shortenUid } from '~/helpers';
import { fromUnixTime } from 'date-fns';
import { formatTime } from '~/helpers/time';
import { Avatar, Root, Title, Timestamp, Body, Content, Header } from './styles';

interface FeedItemBigImageProps {
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

interface ComponentProps {
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
      <Content>
        <Header>
          { avatar && (<Avatar src={avatar}></Avatar>) }
          <Title>
            { title }
          </Title>
          <Timestamp>
            - {formatTime(time)}
          </Timestamp>
        </Header>
        <Body>
          { text }
        </Body>
      </Content>
    </Root>
  );
}

export default FeedItemBigImage;