import { push } from 'connected-react-router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { connectToMessages } from '~/state/places/messagesSlice';
import { joinPlace, selectPlaceById } from '~/state/places/placesSlice';
import { LoadingPage } from '../../loading';

export const JoinPlace: React.FC = () => {
  const dispatch = useDispatch();
  const { placeId, address } = useParams<{
    placeId: string;
    address: string;
  }>();
  const place = useSelector(selectPlaceById(placeId));

  // TODO: password required place

  useEffect(() => {
    dispatch(joinPlace({ placeId, address }));
  }, [dispatch, placeId, address]);

  console.log(place);
  useEffect(() => {
    if (place?.feedAddress) {
      dispatch(connectToMessages({ placeId, address: place.feedAddress }));
      dispatch(push(`/places/${placeId}`));
    }
  }, [place?.feedAddress, dispatch, placeId]);

  return <LoadingPage text="Connecting to place..." />;
};
