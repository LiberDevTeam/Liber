import Observer from '@researchgate/react-intersection-observer';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';
import { VariableSizeList } from 'react-window';
import styled, { css } from 'styled-components';
import { IpfsContent } from '~/components/ipfs-content';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { SvgDefaultUserAvatar as DefaultUserAvatarIcon } from '~/icons/DefaultUserAvatar';
import { SvgLogo } from '~/icons/Logo';
import {
  FeedItem,
  fetchFeedItems,
  ItemType,
  selectFeed,
} from '~/state/feed/feedSlice';
import { selectMe } from '~/state/me/meSlice';
import BaseLayout from '../../templates';
import {
  FeedItemMessageDefault,
  FeedItemPlaceDefault,
} from './components/feed-item';

const HEADER_HEIGHT = 90;

const hideHeader = css`
  transition-timing-function: ease;
  transition: transform 0.6s;
  transform: translate(0, -${HEADER_HEIGHT}px);
`;

const showHeader = css`
  transition-timing-function: ease;
  transition: transform 0.3s;
  transform: translate(0, 0);
`;

const Header = styled.header<{ hide: boolean }>`
  position: fixed;
  z-index: ${(props) => props.theme.zIndex.front};
  width: 100%;
  padding-top: ${(props) => props.theme.space[3]}px;
  background-color: ${(props) => props.theme.colors.white};
  box-shadow: ${(props) => props.theme.shadows[1]};

  ${(props) => (props.hide ? hideHeader : showHeader)};
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.space[3]}px;
  padding: 0 ${(props) => props.theme.space[3]}px;
`;

const Avatar = styled(IpfsContent)`
  border-radius: ${(props) => props.theme.radii.round};
`;

const AvatarContainer = styled.div`
  width: 3rem;
  height: 3rem;
  box-shadow: ${(props) => props.theme.shadows[1]};
  border-radius: ${(props) => props.theme.radii.round};
  margin-right: ${(props) => props.theme.space[2]}px;
`;

const Greeting = styled.div`
  font-size: ${(props) => props.theme.fontSizes['2xl']};
  font-weight: ${(props) => props.theme.fontWeights.light};
  color: ${(props) => props.theme.colors.secondaryText};
  margin-bottom: ${(props) => props.theme.space[3]}px;
  padding: 0 ${(props) => props.theme.space[3]}px;
`;

const Username = styled.div`
  font-size: ${(props) => props.theme.fontSizes['4xl']};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  padding: 0 ${(props) => props.theme.space[3]}px;
  margin-bottom: ${(props) => props.theme.space[3]}px;
`;

const Feed = styled.div`
  flex: 1;
  padding: 0 ${(props) => props.theme.space[3]}px;
`;

const ItemContainer = styled.div`
  display: flex;
  border-bottom: ${(props) =>
    props.theme.border.thin(props.theme.colors.gray2)};
  padding: ${(props) => props.theme.space[4]}px 0;
`;

const Logo = styled(SvgLogo)`
  height: 32px;
`;

export const HomePage: React.FC = memo(function HomePage() {
  const dispatch = useAppDispatch();
  const me = useSelector(selectMe);
  const listRef = useRef<VariableSizeList<any>>(null);
  const hasNext = useAppSelector((state) => state.feed.hasNext);
  const items = useSelector(selectFeed);
  const itemHeights = useRef<{ [index: number]: number }>({});
  const [hideHeader, setHideHeader] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchFeedItems());
    }
  }, [dispatch, items.length]);

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

  const handleEnterFooter = useCallback(() => {
    if (hasNext && items.length > 0) {
      dispatch(fetchFeedItems({ hash: items[items.length - 1].feedHash }));
    }
  }, [hasNext, dispatch, items]);

  return (
    <BaseLayout
      header={
        <Header hide={hideHeader}>
          <HeaderTop>
            <Logo />
            <AvatarContainer>
              <Link to="/profile">
                {me.avatarCid ? (
                  <Avatar cid={me.avatarCid} />
                ) : (
                  <DefaultUserAvatarIcon />
                )}
              </Link>
            </AvatarContainer>
          </HeaderTop>
        </Header>
      }
    >
      <Feed>
        <Virtuoso
          data={items}
          endReached={handleEnterFooter}
          components={{
            Header: function Header() {
              return (
                <Observer
                  rootMargin="-90px 0px 0px 0px"
                  onChange={({ isIntersecting }) =>
                    setHideHeader(!isIntersecting)
                  }
                >
                  <div style={{ height: HEADER_HEIGHT }} />
                </Observer>
              );
            },
          }}
          itemContent={(index, item) => (
            <ItemContainer>
              <Item item={item} onRender={handleRenderRow} index={index} />
            </ItemContainer>
          )}
        />
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
