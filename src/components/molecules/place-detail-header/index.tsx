import React from 'react';
import { Place } from '~/state/ducks/places/placesSlice';
import styled from 'styled-components';
import { PersonAdd as AddUserIcon } from '@material-ui/icons';
import { IconButton } from '../../atoms/icon-button';

const Root = styled.header`
  padding: ${(props) => props.theme.space[6]}px;
  border-bottom: 3px solid ${(props) => props.theme.colors.border};
`;

const TitleLine = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const Avatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: ${(props) => props.theme.radii.medium};
`;

const Title = styled.h2`
  color: ${(props) => props.theme.colors.primaryText};
  font-size: ${(props) => props.theme.fontSizes.lg};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  margin-left: ${(props) => props.theme.space[6]}px;
`;

const Actions = styled.div`
  position: absolute;
  right: 0;
`;

const Description = styled.div`
  color: ${(props) => props.theme.colors.secondaryText};
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  word-break: break-all;
  margin-top: ${(props) => props.theme.space[4]}px;
`;

export interface PlaceDetailHeaderProps {
  place: Place;
  onInviteClick: () => void;
}

export const PlaceDetailHeader: React.FC<PlaceDetailHeaderProps> = React.memo(
  function PlaceDetailHeader({ place, onInviteClick }) {
    return (
      <Root>
        <TitleLine>
          <Avatar src={place.avatarImage} />
          <Title>{place.name}</Title>
          <Actions>
            <IconButton
              icon={<AddUserIcon fontSize="large" />}
              title="Invite people"
              onClick={onInviteClick}
            />
          </Actions>
        </TitleLine>
        <Description>{place.description}</Description>
      </Root>
    );
  }
);
