import { fromUnixTime } from 'date-fns';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { shortenUid } from '~/helpers';
import { formatTime } from '~/helpers/time';
import { getIpfsNode } from '~/lib/ipfs';
import { FeedItem, ItemKind } from '~/state/feed/feedSlice';
import {
  downloadIpfsContent,
  selectIpfsContentByCid,
} from '~/state/p2p/ipfsContentsSlice';
import {
  Avatar,
  Body,
  Content,
  Header,
  Root,
  Timestamp,
  Title,
} from './elements';

interface FeedItemBigImageProps {
  item: FeedItem;
}

const FeedItemBigImage: React.FC<FeedItemBigImageProps> = ({ item }) => {
  switch (item.kind) {
    case ItemKind.MESSAGE:
      return (
        <Component
          bgCid={item.attachmentCidList[0]}
          title={item.author.name || shortenUid(item.author)}
          avatarCid={item.author.avatarCid}
          text={item.text}
          timestamp={item.timestamp}
        />
      );
    case ItemKind.PLACE:
      return (
        <Component
          bgCid={item.avatarCid}
          title={item.name}
          text={item.description}
          timestamp={item.timestamp}
        />
      );
  }
};

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

export default FeedItemBigImage;
