import React from 'react';
import BaseLayout from '~/templates';
import { SvgDefaultUserAvatar as DefaultUserAvatarIcon } from '~/icons/DefaultUserAvatar';
import { SvgBellOutline as BellOutlineIcon } from '~/icons/BellOutline';
import { selectMe } from '~/state/ducks/me/meSlice';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.space[10]}px;
`

const Avatar = styled.img`
  border-radius: ${(props) => props.theme.radii.round};
`;

const AvatarContainer = styled.div`
  width: ${(props) => props.theme.space[14]}px;
  height: ${(props) => props.theme.space[14]}px;
  filter: drop-shadow(
    ${(props) => props.theme.space[0]}px
    ${(props) => props.theme.space[2]}px
    ${(props) => props.theme.space[4]}px
    rgba(143, 167, 179, 0.5)
  );
`

const Notification = styled.div`
  width: ${(props) => props.theme.space[14]}px;
  height: ${(props) => props.theme.space[14]}px;
  border-radius: ${(props) => props.theme.radii.round};
  border: 1px solid ${(props) => props.theme.colors.gray};
  display: flex;
  justify-content: center;
  align-items: center;
`

const BellIconContainer = styled.div`
  width: ${(props) => props.theme.space[7]}px;
  height: ${(props) => props.theme.space[7]}px;
`

const Greeting = styled.div`
  font-size: ${(props) => props.theme.fontSizes['2xl']};
  font-weight: ${(props) => props.theme.fontWeights.light};
  color: ${(props) => props.theme.colors.secondaryText};
  margin-bottom: ${(props) => props.theme.space[3]}px;
`

const Username = styled.div`
  font-size: ${(props) => props.theme.fontSizes['4xl']};
  font-weight: ${(props) => props.theme.fontWeights.bold};
`

const Feed = styled.div`
`

const FeedItemBigImage = styled.div`
`

const FeedItemNormal = styled.div`
`

const IndexPage: React.FC = () => {
  const me = useSelector(selectMe);
  return (
    <BaseLayout>
      <Header>
        <AvatarContainer>
          { me.avatarImage ? (<Avatar src={me.avatarImage} />) : (<DefaultUserAvatarIcon />) }
        </AvatarContainer>
        <Notification>
          <BellIconContainer>
            <BellOutlineIcon />
          </BellIconContainer>
        </Notification>
      </Header>
      <Greeting>Hello 😊</Greeting>
      { me.username && (<Username>{me.username}</Username>) }
      <Feed>
        <FeedItemBigImage></FeedItemBigImage>
        <FeedItemNormal></FeedItemNormal>
      </Feed>
    </BaseLayout>
  );
};

export default IndexPage;
