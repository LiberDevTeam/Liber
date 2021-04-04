import React from 'react';
import { FeedItem, ItemKind } from "~/state/ducks/feed/feedSlice";
import { shortenUid } from '~/helpers';
import { fromUnixTime } from 'date-fns';
import { formatTime } from '~/helpers/time';
import { Avatar, Root, Title, Timestamp, Body, Content, Header } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { selectIpfsContentByCID } from '~/state/ducks/p2p/ipfsContentsSlice';

type FeedItemBigImageProps = {
  item: FeedItem;
}

const FeedItemBigImage: React.FC<FeedItemBigImageProps> = ({ item }) => {
  switch (item.kind) {
    case ItemKind.MESSAGE:
      return (
        <Component
          bgCid={item.attachmentCidList && item.attachmentCidList[0] }
          title={item.author.username || shortenUid(item.author.id)}
          avatarCid={item.author.avatarCid}
          text={item.text}
          timestamp={item.timestamp} />
      );
    case ItemKind.PLACE:
      return (
        <Component
          bgCid={item.avatarCid}
          title={item.name}
          text={item.description}
          timestamp={item.timestamp} />
      );
  }
}

type ComponentProps = {
  bgCid?: string;
  title: string;
  avatarCid?: string;
  text?: string;
  timestamp: number;
}

const Component: React.FC<ComponentProps> = ({ bgCid, title, avatarCid, text, timestamp }) => {
  const bgContent = useSelector(selectIpfsContentByCID(bgCid || ''));
  const time = fromUnixTime(timestamp);
  return (
    <Root bgImg={bgContent?.dataUrl || ""}>
      <Content>
        <Header>
          { avatarCid && (<Avatar cid={avatarCid}></Avatar>) }
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