import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button } from '~/components/button';
import { Input } from '~/components/input';
import { IpfsContent } from '~/components/ipfs-content';
import { Modal } from '~/components/modal';
import {
  openProtectedPlace,
  selectPlaceById,
} from '~/state/ducks/places/placesSlice';

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${(props) => props.theme.space[2]}px;

  & > * {
    margin-top: ${(props) => props.theme.space[4]}px;
  }
`;

const PlaceName = styled.div`
  text-align: center;
  font-size: ${(props) => props.theme.fontSizes.xl};
  font-weight: ${(props) => props.theme.fontWeights.bold};
`;

const PlaceDescription = styled.div`
  text-align: center;
  color: ${(props) => props.theme.colors.secondaryText};
`;

const JoinButton = styled(Button)`
  width: 100%;
`;

const LoadingAvatar = styled.div`
  width: 64px;
  height: 64px;
  background-color: ${(props) => props.theme.colors.bg3};
  border-radius: ${(props) => props.theme.radii.round};
`;

export interface PasswordDialogProps {
  pid: string;
  onClose: () => void;
}

export const PasswordDialog: React.FC<PasswordDialogProps> = React.memo(
  function PasswordDialog({ onClose, pid }) {
    const place = useSelector(selectPlaceById(pid));
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const handleJoin = useCallback(() => {
      dispatch(openProtectedPlace({ password, placeId: pid }));
    }, [dispatch, password, pid]);

    if (!place) {
      return null;
    }

    return (
      <Modal open onClose={onClose}>
        <Body>
          <IpfsContent
            style={{ width: 64, height: 64 }}
            cid={place.avatarCid}
            fallbackComponent={<LoadingAvatar />}
          />
          <PlaceName>{place.name}</PlaceName>
          <PlaceDescription>{place.description}</PlaceDescription>
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <JoinButton text="JOIN" onClick={handleJoin} />
        </Body>
      </Modal>
    );
  }
);
