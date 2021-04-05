import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { joinPlace } from '~/state/ducks/p2p/p2pSlice';

export const JoinPlace: React.FC = () => {
  const dispatch = useDispatch();
  const { placeId, address } = useParams<{
    placeId: string;
    address: string;
  }>();
  useEffect(() => {
    dispatch(joinPlace({ placeId, address }));
  }, [dispatch, placeId, address]);
  return null;
};
