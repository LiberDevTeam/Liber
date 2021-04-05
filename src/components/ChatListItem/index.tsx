import {
  formatDistanceToNowStrict,
  fromUnixTime,
  differenceInHours,
} from 'date-fns';
import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Place } from '~/state/ducks/places/placesSlice';
import { useFnsLocale } from '~/state/hooks/fnsLocale';

const activeClassName = 'selected-place';

type ActiveStatus = 'active' | 'modest' | 'inactive';

const Root = styled(NavLink)`
  display: flex;
  width: 100%;
  padding: ${(props) => props.theme.space[1]}px;
  border-radius: ${(props) => props.theme.radii.medium}px;
  text-decoration: none;
  align-items: center;

  &.${activeClassName} {
    background: ${(props) => props.theme.colors.bg2};
    border: 2px solid ${(props) => props.theme.colors.primary};
  }

  &:hover {
    cursor: pointer;
    background: ${(props) => props.theme.colors.bg2};
  }
`;

const LeftContainer = styled.div`
  width: 54px;
  height: 54px;
  min-width: 54px;
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.colors.bg2};
  border-radius: ${(props) => props.theme.radii.round};
`;

const Status = styled.div<{ status: ActiveStatus }>`
  width: 14px;
  height: 14px;
  position: absolute;
  bottom: 0px;
  right: 0px;
  border-radius: ${(props) => props.theme.radii.round};
  border: 2px solid ${(props) => props.theme.colors.bg};
  background: ${(props) => {
    switch (props.status) {
      case 'active':
        return props.theme.colors.green;
      case 'modest':
        return props.theme.colors.yellow;
      case 'inactive':
        return props.theme.colors.bg4;
    }
  }};
`;

const CenterContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: ${(props) => props.theme.space[4]}px;
  overflow: hidden;
`;
const Title = styled.div`
  color: ${(props) => props.theme.colors.primaryText};
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: ${(props) => props.theme.fontWeights.medium};
`;
const Description = styled.div`
  color: ${(props) => props.theme.colors.primaryText};
  font-size: ${(props) => props.theme.fontSizes.sm};
  font-weight: ${(props) => props.theme.fontWeights.normal};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-top: ${(props) => props.theme.space[1]}px;
`;

const RightContainer = styled.div`
  text-align: right;
`;
const Time = styled.div`
  color: ${(props) => props.theme.colors.secondaryText};
  font-size: ${(props) => props.theme.fontSizes.xxs};
  font-weight: ${(props) => props.theme.fontWeights.normal};
`;
const UnreadCount = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  font-size: ${(props) => props.theme.fontSizes.xxs};
  line-height: ${(props) => props.theme.fontSizes.xs};
  border-radius: ${(props) => props.theme.radii.large}px;
  color: ${(props) => props.theme.colors.lightText};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  background: ${(props) => props.theme.colors.primary};
  margin-top: ${(props) => props.theme.space[2]}px;
`;

const calcStatusFromTime = (time: Date): ActiveStatus => {
  const diff = differenceInHours(new Date(), time);
  console.log(diff);

  if (diff > 24) {
    return 'inactive';
  }

  if (diff > 6) {
    return 'modest';
  }

  return 'active';
};

export interface ChatListItemProps {
  place: Place;
}

export const ChatListItem: React.FC<ChatListItemProps> = React.memo(
  function ChatListItem({ place }) {
    const locale = useFnsLocale();
    const [time, status] = useMemo(() => {
      const date = fromUnixTime(place.timestamp);
      return [
        formatDistanceToNowStrict(date, { addSuffix: true, locale }),
        calcStatusFromTime(date),
      ];
    }, [place.timestamp, locale]);

    return (
      <Root to={`/places/${place.id}`} activeClassName={activeClassName}>
        <LeftContainer>
          <Image src={place.avatar} />
          <Status status={status} />
        </LeftContainer>
        <CenterContainer>
          <Title>{place.name}</Title>
          <Description>{place.description}</Description>
        </CenterContainer>
        <RightContainer>
          <Time>{time}</Time>
          {place.unreadMessages.length > 0 ? (
            <UnreadCount>
              {place.unreadMessages.length > 99
                ? '99+'
                : place.unreadMessages.length}
            </UnreadCount>
          ) : null}
        </RightContainer>
      </Root>
    );
  }
);
