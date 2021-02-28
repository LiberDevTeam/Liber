import {
  formatDistanceToNowStrict,
  fromUnixTime,
  differenceInHours,
} from 'date-fns';
import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Place } from '~/state/ducks/places/placesSlice';

const activeClassName = 'selected-place';

type ActiveStatus = 'active' | 'modest' | 'inactive';

const Root = styled(NavLink)`
  display: inline-flex;
  width: 100%;
  padding: ${(props) => props.theme.space[1]}px;
  border-radius: ${(props) => props.theme.radii.medium}px;
  border: 2px solid white;
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
  width: 60px;
  height: 60px;
  min-width: 60px;
  position: relative;
  padding: ${(props) => props.theme.space[1]}px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.colors.bg2};
  border-radius: ${(props) => props.theme.radii.medium}px;
`;

const Status = styled.div<{ status: ActiveStatus }>`
  width: 12px;
  height: 12px;
  position: absolute;
  top: 0px;
  right: 0px;
  border-radius: ${(props) => props.theme.radii.round};
  border: 1px solid ${(props) => props.theme.colors.bg};
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

const RightContainer = styled.div`
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
  color: ${(props) => props.theme.colors.secondaryText};
  font-size: ${(props) => props.theme.fontSizes.sm};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const Time = styled.div`
  color: ${(props) => props.theme.colors.secondaryText};
  font-size: ${(props) => props.theme.fontSizes.sm};
  font-weight: ${(props) => props.theme.fontWeights.semibold};
`;

const UnreadCount = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  padding: ${(props) => props.theme.space[1]}px;
  font-size: ${(props) => props.theme.fontSizes.xxs};
  border-radius: ${(props) => props.theme.radii.large}px;
  color: ${(props) => props.theme.colors.lightText};
  background: ${(props) => props.theme.colors.primary};
  margin-right: ${(props) => props.theme.space[2]}px;
  box-shadow: ${(props) => props.theme.space[2]}px;
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

export interface PlaceListColumnItemProps {
  place: Place;
}

export const PlaceListColumnItem: React.FC<PlaceListColumnItemProps> = React.memo(
  function PlaceListColumnItem({ place }) {
    const [dispTime, status] = useMemo(() => {
      const date = fromUnixTime(place.timestamp);
      return [
        formatDistanceToNowStrict(date, { addSuffix: true }),
        calcStatusFromTime(date),
      ];
    }, [place.timestamp]);

    return (
      <Root to={`/places/${place.id}`} activeClassName={activeClassName}>
        <LeftContainer>
          <Image src={place.avatarImage} />
          <Status status={status} />
        </LeftContainer>
        <RightContainer>
          <Title>{place.name}</Title>
          <Description>{place.description}</Description>
          <Time>{dispTime}</Time>
        </RightContainer>
        {place.unreadMessages.length > 0 ? (
          <UnreadCount>
            {place.unreadMessages.length > 99
              ? '99+'
              : place.unreadMessages.length}
          </UnreadCount>
        ) : null}
      </Root>
    );
  }
);
