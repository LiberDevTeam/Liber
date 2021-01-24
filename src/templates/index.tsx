import React, { useEffect } from 'react';
import { selectMe } from '~/state/ducks/me/meSlice';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { connect } from '~/connection';
import { rtcCreateOffer } from '~/connection/actions';
import Navbar from '~/components/organisms/navbar';

const BaseLayout: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);

  // TODO use server notification to trigger to connect.
  useEffect(() => {
    dispatch(connect(`ws://192.168.10.101:3000/ws?uid=${me.id}`, me));
  }, []);

  return (
    <div>
      <header className="App-header">
        <Navbar
          channels={me.channels}
          moveToNewChannel={() => {
            dispatch(push('/channels/new'));
          }}
          moveToChannel={(cid: string) => {
            dispatch(rtcCreateOffer(cid, me));
            dispatch(push(`/channels/${cid}`));
          }}
        />
      </header>
      <main>{children}</main>
    </div>
  );
};

export default BaseLayout;
