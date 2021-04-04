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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.space[10]}px;
`;

const Avatar = styled.img`
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
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const feed = useSelector(selectFeed);

  useEffect(() => {
    dispatch(fetchFeedItems());
  }, []);

  return (
    <BaseLayout>
      <Header>
        <AvatarContainer>
          {me.avatarImage ? (
            <Avatar src={me.avatarImage} />
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
        {feed.items.map((item) => (
          <ItemContainer key={item.id}>
            <Item item={item} />
          </ItemContainer>
        ))}
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

export default HomePage;
