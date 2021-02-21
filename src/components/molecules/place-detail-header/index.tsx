import React, { useState } from 'react';
import { Place } from '~/state/ducks/places/placesSlice';
import styled from 'styled-components';
import {
  PersonAdd as AddUserIcon,
  MoreVert as MenuIcon,
  ExitToApp as LeaveIcon,
} from '@material-ui/icons';
import { IconButton } from '../../atoms/icon-button';
import Dropdown from 'rc-dropdown';
import { Button } from '~/components/atoms/button';
import 'rc-dropdown/assets/index.css';

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
  flex: 1;
  color: ${(props) => props.theme.colors.primaryText};
  font-size: ${(props) => props.theme.fontSizes.lg};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  margin-left: ${(props) => props.theme.space[6]}px;
`;

const Actions = styled.div`
  & > * {
    margin-left: ${(props) => props.theme.space[4]}px;
  }
`;

const Description = styled.div`
  color: ${(props) => props.theme.colors.secondaryText};
  font-size: ${(props) => props.theme.fontSizes.md};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  word-break: break-all;
  margin-top: ${(props) => props.theme.space[4]}px;
`;

const Menu = styled.div`
  min-width: 230px;
  background: ${(props) => props.theme.colors.bg};
  box-shadow: ${(props) => props.theme.shadows[1]};
  border-radius: ${(props) => props.theme.radii.medium}px;
  padding: ${(props) => props.theme.space[2]}px;
`;

const LeaveButton = styled(Button)`
  color: ${(props) => props.theme.colors.red};
  width: 100%;
  justify-content: flex-start;
`;

export interface PlaceDetailHeaderProps {
  place: Place;
  onInviteClick: () => void;
  onLeave: () => void;
}

export const PlaceDetailHeader: React.FC<PlaceDetailHeaderProps> = React.memo(
  function PlaceDetailHeader({ place, onInviteClick, onLeave }) {
    const [openMenu, setOpenMenu] = useState(false);

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

            <Dropdown
              visible={openMenu}
              onVisibleChange={() => setOpenMenu(false)}
              overlay={() => (
                <Menu>
                  <LeaveButton
                    shape="square"
                    variant="text"
                    text="Leave Place"
                    onClick={onLeave}
                    icon={<LeaveIcon />}
                  />
                </Menu>
              )}
            >
              <IconButton
                icon={<MenuIcon fontSize="large" />}
                title="Open menu"
                onClick={() => setOpenMenu(!openMenu)}
              />
            </Dropdown>
          </Actions>
        </TitleLine>
        <Description>{place.description}</Description>
      </Root>
    );
  }
);
