import React, { memo, useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ListOnItemsRenderedProps, VariableSizeList } from 'react-window';
import styled from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { SvgBellOutline as BellOutlineIcon } from '~/icons/BellOutline';
import { SvgDefaultUserAvatar as DefaultUserAvatarIcon } from '~/icons/DefaultUserAvatar';
import {
  FeedItem,
  fetchFeedItems,
  ItemType,
  selectFeed,
} from '~/state/feed/feedSlice';
import { selectMe } from '~/state/me/meSlice';
import { theme } from '~/theme';
import { username } from '../../helpers';
import BaseLayout from '../../templates';
import {
  FeedItemMessageDefault,
  FeedItemPlaceDefault,
} from './components/feed-item';

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

let loading = false;
export const HomePage: React.FC = memo(function HomePage() {
  const dispatch = useAppDispatch();
  const me = useSelector(selectMe);
  const listRef = useRef<VariableSizeList<any>>(null);
  const hasNext = useAppSelector((state) => state.feed.hasNext);
  const items = useSelector(selectFeed);
  const itemHeights = useRef<{ [index: number]: number }>({});

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchFeedItems());
    }
  }, [dispatch]);

  const handleRenderRow = useCallback(
    (index: number, clientHeight: number) => {
      if (
        itemHeights.current[index] === undefined ||
        // Update only if the new height is greater than the current height.
        itemHeights.current[index] < clientHeight
      ) {
        itemHeights.current[index] = clientHeight;
        listRef.current?.resetAfterIndex(index);
      }
    },
    [listRef]
  );

  const handleItemRendered = async ({
    visibleStopIndex,
  }: ListOnItemsRenderedProps) => {
    if (items.length === visibleStopIndex + 1 && loading === false && hasNext) {
      loading = true;
      await dispatch(
        fetchFeedItems({ hash: items[items.length - 1].feedHash })
      );
      loading = false;
    }
  };

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
        <AutoSizer>
          {({ height, width }) => (
            <VariableSizeList
              height={height}
              itemCount={items.length}
              itemSize={(index) => {
                return (
                  itemHeights.current[index] + theme.space[8] || theme.space[14]
                );
              }}
              onItemsRendered={handleItemRendered}
              width={width}
              ref={listRef}
            >
              {({ index, style }) => (
                <ItemContainer key={items[index].id} style={style}>
                  <Item
                    index={index}
                    item={items[index]}
                    onRender={handleRenderRow}
                  />
                </ItemContainer>
              )}
            </VariableSizeList>
          )}
        </AutoSizer>
      </Feed>
    </BaseLayout>
  );
});

interface ItemProps {
  index: number;
  item: FeedItem;
  onRender: (index: number, clientHeight: number) => void;
}

const Item: React.FC<ItemProps> = memo(function Item({
  index,
  item,
  onRender,
}) {
  const handleRender = (clientHeight: number) => {
    onRender(index, clientHeight);
  };

  switch (item.itemType) {
    case ItemType.MESSAGE:
      return <FeedItemMessageDefault message={item} onRender={handleRender} />;
    case ItemType.PLACE:
      return <FeedItemPlaceDefault place={item} onRender={handleRender} />;
  }
});
