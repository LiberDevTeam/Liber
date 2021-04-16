import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList } from 'react-window';
import styled from 'styled-components';
import { IpfsContent } from '../../components/ipfs-content';
import { username } from '../../helpers';
import { SvgBellOutline as BellOutlineIcon } from '../../icons/BellOutline';
import { SvgDefaultUserAvatar as DefaultUserAvatarIcon } from '../../icons/DefaultUserAvatar';
import {
  Appearance,
  FeedItem,
  fetchFeedItems,
  ItemKind,
  selectFeed,
} from '../../state/ducks/feed/feedSlice';
import { selectMe } from '../../state/ducks/me/meSlice';
import BaseLayout from '../../templates';
import { theme } from '../../theme';
import FeedItemDefault from './components/feed-item';
import FeedItemBigImage from './components/feed-item-big-image';

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
  border-bottom: ${(props) => props.theme.border.grayLight.thin};
  padding: ${(props) => props.theme.space[4]}px 0;
`;

const feedHeight = {
  [Appearance.DEFAULT]: {
    [ItemKind.MESSAGE]: 320 + theme.space[14],
    [ItemKind.PLACE]: 320 + theme.space[4],
  },
  [Appearance.BIG_CARD]: {
    [ItemKind.MESSAGE]: 620 + theme.space[4],
    [ItemKind.PLACE]: 800 + theme.space[4],
  },
};

export const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const feed = useSelector(selectFeed);

  useEffect(() => {
    dispatch(fetchFeedItems());
  }, [dispatch]);

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
              itemCount={feed.items.length}
              itemSize={(index) => {
                return feedHeight[feed.items[index].appearance][
                  feed.items[index].kind
                ];
              }}
              width={width}
            >
              {({ index, style }) => (
                <ItemContainer key={feed.items[index].id} style={style}>
                  <Item item={feed.items[index]} />
                </ItemContainer>
              )}
            </VariableSizeList>
          )}
        </AutoSizer>
      </Feed>
    </BaseLayout>
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
