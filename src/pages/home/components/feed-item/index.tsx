import React from 'react';
import { shortenUid } from '~/helpers';
import { formatTime } from '~/helpers/time';
import { FeedItem, ItemKind } from '~/state/ducks/feed/feedSlice';
import {
  Avatar,
  Header,
  Timestamp,
  Title,
  Text,
  Attachment,
  Root,
} from './elements';
import { fromUnixTime } from 'date-fns';

interface FeedItemDefaultProps {
  item: FeedItem;
}

const FeedItemDefault: React.FC<FeedItemDefaultProps> = ({ item }) => {
  switch (item.kind) {
    case ItemKind.MESSAGE:
      return (
        <Component
          id={item.id}
          attachmentCidList={item.attachmentCidList}
          title={item.author.username || shortenUid(item.author.id)}
          avatarCid={item.author.avatarCid}
          text={item.text}
          timestamp={item.timestamp}
        />
      );
    case ItemKind.PLACE:
      return (
        <Component
          id={item.id}
          attachmentCidList={[item.avatarCid]}
          title={item.name}
          text={item.description}
          timestamp={item.timestamp}
        />
      );
  }
};

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

export default FeedItemDefault;
