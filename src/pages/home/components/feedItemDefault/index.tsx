import React from 'react';
import { shortenUid } from '~/helpers';
import { formatTime } from '~/helpers/time';
import { FeedItem, ItemKind } from "~/state/ducks/feed/feedSlice";
import { Attachment as AttachmentType } from '~/state/ducks/places/messagesSlice';
import { Avatar, Header, Timestamp, Title, Text } from './styles';
import { fromUnixTime } from 'date-fns';
import { Attachment } from '~/components/attachment';

interface FeedItemDefaultProps {
  item: FeedItem;
}

const FeedItemDefault: React.FC<FeedItemDefaultProps> = ({ item }) => {
  switch (item.kind) {
    case ItemKind.MESSAGE:
      return (
        <Component
          attachments={item.attachments && item.attachments}
          title={item.author.username || shortenUid(item.author.id)}
          avatar={item.author.avatarImage}
          text={item.text}
          timestamp={item.timestamp} />
      );
    case ItemKind.PLACE:
      return (
        <Component
          attachments={[{ ipfsCid: "", dataUrl: item.avatarImage }]}
          title={item.name}
          text={item.description}
          timestamp={item.timestamp} />
      );
  }
}

interface ComponentProps {
  title: string;
  attachments?: AttachmentType[];
  avatar?: string;
  text?: string;
  timestamp: number;
}

const Component: React.FC<ComponentProps> = ({
  title,
  attachments,
  avatar,
  text,
  timestamp,
}) => {
  const time = fromUnixTime(timestamp);
  return (
    <>
      <Header>
        <Title>
          { avatar && (<Avatar src={avatar}></Avatar>) }
          { title }
        </Title>
        <Timestamp>
          {formatTime(time)}
        </Timestamp>
      </Header>
      <Text>
        { text }
      </Text>
      { attachments && attachments.map(a => (
        <Attachment attachment={a} key={a.ipfsCid}/>
      ))}
    </>
  );
}

export default FeedItemDefault;