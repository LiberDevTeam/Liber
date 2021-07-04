import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';
import { SvgBellOutline as BellOutlineIcon } from '~/icons/BellOutline';
import { SvgDefaultUserAvatar as DefaultUserAvatarIcon } from '~/icons/DefaultUserAvatar';
import {
  Appearance,
  FeedItem,
  fetchFeedItems,
  ItemType,
  limit,
  selectFeed,
} from '~/state/feed/feedSlice';
import { selectMe } from '~/state/me/meSlice';
import { username } from '../../helpers';
import BaseLayout from '../../templates';
import { theme } from '../../theme';
import {
  FeedItemMessageDefault,
  FeedItemPlaceDefault,
} from './components/feed-item';
import {
  FeedItemMessageBigImage,
  FeedItemPlaceBigImage,
} from './components/feed-item-big-image';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.space[10]}px;
  padding: 0 ${(props) => props.theme.space[5]}px;
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
  border: ${(props) => props.theme.border.thin(props.theme.colors.gray)};
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
  padding: 0 ${(props) => props.theme.space[5]}px;
`;

const Username = styled.div`
  font-size: ${(props) => props.theme.fontSizes['4xl']};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  padding: 0 ${(props) => props.theme.space[5]}px;
  margin-bottom: ${(props) => props.theme.space[3]}px;
`;

const Feed = styled.div`
  flex: 1;
  padding: 0 ${(props) => props.theme.space[5]}px;
`;

const ItemContainer = styled.div`
  display: flex;
  border-bottom: ${(props) =>
    props.theme.border.thin(props.theme.colors.gray2)};
  padding: ${(props) => props.theme.space[4]}px 0;
`;

const feedHeight = {
  [Appearance.DEFAULT]: {
    [ItemType.MESSAGE]: 320 + theme.space[14],
    [ItemType.PLACE]: 320 + theme.space[4],
  },
  [Appearance.BIG_CARD]: {
    [ItemType.MESSAGE]: 500 + theme.space[4],
    [ItemType.PLACE]: 500 + theme.space[4],
  },
};

export const HomePage: React.FC = memo(function HomePage() {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const items = useSelector(selectFeed);
  const [appearance, setAppearance] = useState<{ [key: string]: Appearance }>(
    {}
  );

  useEffect(() => {
    dispatch(fetchFeedItems());
  }, []);

  useEffect(() => {
    setAppearance(
      items.reduce((prev, item) => {
        // TODO improve the decision logic
        if (
          Math.floor(Math.random() * 10) === 0 &&
          ((item.itemType === ItemType.MESSAGE &&
            item.attachmentCidList?.length) ||
            (item.itemType === ItemType.PLACE && item.avatarCid))
        ) {
          return {
            ...prev,
            [item.id]: Appearance.BIG_CARD,
          };
        }
        return {
          ...prev,
          [item.id]: Appearance.DEFAULT,
        };
      }, {})
    );
  }, [items]);

  // wait for finishing the initialization of appearance.
  if (items.length && appearance[items[items.length - 1].id] === undefined) {
    return null;
  }

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
      <Feed>
        <InfiniteLoader
          isItemLoaded={() => true}
          itemCount={limit}
          loadMoreItems={(): Promise<any> | null =>
            new Promise<any>(() => {
              dispatch(
                fetchFeedItems({ hash: items[items.length - 1].feedHash })
              );
            })
          }
        >
          {({ onItemsRendered, ref }) => (
            <AutoSizer>
              {({ height, width }) => (
                <VariableSizeList
                  height={height}
                  onItemsRendered={onItemsRendered}
                  itemCount={items.length}
                  itemSize={(index) => {
                    return feedHeight[appearance[items[index].id]][
                      items[index].itemType
                    ];
                  }}
                  width={width}
                  ref={ref}
                >
                  {({ index, style }) => (
                    <ItemContainer key={items[index].id} style={style}>
                      <Item
                        item={items[index]}
                        appearance={appearance[items[index].id]}
                      />
                    </ItemContainer>
                  )}
                </VariableSizeList>
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
      </Feed>
    </BaseLayout>
  );
});

interface ItemProps {
  appearance: Appearance;
  item: FeedItem;
}

const Item: React.FC<ItemProps> = memo(function Item({ item, appearance }) {
  switch (item.itemType) {
    case ItemType.MESSAGE:
      switch (appearance) {
        case Appearance.BIG_CARD:
          return <FeedItemMessageBigImage message={item} />;
        case Appearance.DEFAULT:
          return <FeedItemMessageDefault message={item} />;
        default:
          return <FeedItemMessageDefault message={item} />;
      }
    case ItemType.PLACE:
      switch (appearance) {
        case Appearance.BIG_CARD:
          return <FeedItemPlaceBigImage place={item} />;
        case Appearance.DEFAULT:
          return <FeedItemPlaceDefault place={item} />;
        default:
          return <FeedItemPlaceDefault place={item} />;
      }
  }
});
