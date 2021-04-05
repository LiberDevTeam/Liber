import React, { useEffect } from 'react';
import BaseLayout from '~/templates';
import { SvgDefaultUserAvatar as DefaultUserAvatarIcon } from '~/icons/DefaultUserAvatar';
import { SvgBellOutline as BellOutlineIcon } from '~/icons/BellOutline';
import { selectMe } from '~/state/ducks/me/meSlice';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  Appearance,
  FeedItem,
  fetchFeedItems,
  selectFeed,
} from '~/state/ducks/feed/feedSlice';
import FeedItemBigImage from './components/feedItemBigImage';
import FeedItemDefault from './components/feedItemDefault';
import { username } from '~/helpers';
import { IpfsContent } from '~/components/ipfsContent';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.space[10]}px;
`;

const Avatar = styled(IpfsContent)`
  border-radius: ${(props) => props.theme.radii.round};
`;

const AvatarContainer = styled.div`
  width: 3rem;
  height: 3rem;
  box-shadow: ${(props) => props.theme.shadows[1]};
  border-radius: ${(props) => props.theme.radii.round};
`;

const Notification = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: ${(props) => props.theme.radii.round};
  border: ${(props) => props.theme.border.gray.thin};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BellIconContainer = styled.div`
  width: ${(props) => props.theme.space[7]}px;
  height: ${(props) => props.theme.space[7]}px;
`;

const Greeting = styled.div`
  font-size: ${(props) => props.theme.fontSizes['2xl']};
  font-weight: ${(props) => props.theme.fontWeights.light};
  color: ${(props) => props.theme.colors.secondaryText};
  margin-bottom: ${(props) => props.theme.space[3]}px;
`;

const Username = styled.div`
  font-size: ${(props) => props.theme.fontSizes['4xl']};
  font-weight: ${(props) => props.theme.fontWeights.bold};
`;

const Feed = styled.div`
  padding-bottom: 5rem;
`;

const ItemContainer = styled.div`
  border-bottom: ${(props) => props.theme.border.grayLight.thin};
  padding: ${(props) => props.theme.space[7]}px 0;
`;

const HomePage: React.FC = () => {
  const me = useSelector(selectMe);

  return (
    <BaseLayout>
      <Header>
        <AvatarContainer>
          {me.avatarCid ? (
            <Avatar cid={me.avatarCid} />
          ) : (
            <DefaultUserAvatarIcon />
          )}
        </AvatarContainer>
        <Notification>
          <BellIconContainer>
            <BellOutlineIcon />
          </BellIconContainer>
        </Notification>
      </Header>
      <Greeting>Hello 😊</Greeting>
      <Username>{username(me)}</Username>
      <List />
      {/*
      <Feed>
        {feed.items.map((item) => (
          <ItemContainer key={item.id}>
            <Item item={item} />
          </ItemContainer>
        ))}
      </Feed>
       */}
    </BaseLayout>
  );
};

const List: React.FC = () => {
  const dispatch = useDispatch();
  const feed = useSelector(selectFeed);
  const loadMoreItems = async () => {
    const lastTimestamp = feed.items[feed.items.length - 1].timestamp;
    dispatch(fetchFeedItems({ lastTimestamp }));
  };

  useEffect(() => {
    dispatch(fetchFeedItems());
  }, []);

  return (
    <AutoSizer>
      {({ height, width }) => (
        <InfiniteLoader
          isItemLoaded={(index) => index < feed.items.length - 1}
          itemCount={feed.items.length + 1}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }) => (
            <FixedSizeList
              width={width}
              height={height}
              itemCount={items.length + 1}
              itemSize={120}
              onItemsRendered={onItemsRendered}
              ref={ref}
            >
              {({ index, style }) => {
                if (index >= items.length) {
                  return null;
                }
                return (
                  <ItemContainer key={items[index].id} style={style}>
                    <Item item={items[index]} />
                  </ItemContainer>
                );
              }}
            </FixedSizeList>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
};

interface ItemProps {
  item: FeedItem;
}

const Item: React.FC<ItemProps> = ({ item }) => {
  switch (item.appearance) {
    case Appearance.BIG_CARD:
      return <FeedItemBigImage item={item} />;
    case Appearance.DEFAULT:
      return <FeedItemDefault item={item} />;
  }
};

export default HomePage;
