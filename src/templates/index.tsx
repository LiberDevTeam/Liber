import React, { useEffect } from 'react';
import { selectMe } from '~/state/ducks/me/meSlice';
import {
  selectApplication,
  toggleDrawer,
} from '~/state/ducks/application/applicationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { connect } from '~/connection';
import { rtcCreateOffer } from '~/connection/actions';
import Navbar from '~/components/organisms/navbar';

const BaseLayout: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const app = useSelector(selectApplication);

  // TODO use server notification to trigger to connect.
  useEffect(() => {
    dispatch(connect(`ws://192.168.10.101:3000/ws?uid=${me.id}`, me));
  }, []);

  return (
    <div>
      <header className="App-header">
        <Navbar
          showDrawer={app.showDrawer}
          toggleDrawer={() => dispatch(toggleDrawer())}
          channels={me.channels}
          moveToNewChannel={() => {
            dispatch(push('/channels/new'));
            dispatch(toggleDrawer());
          }}
          moveToChannel={(cid: string) => {
            dispatch(rtcCreateOffer(cid, me));
            dispatch(push(`/channels/${cid}`));
            dispatch(toggleDrawer());
          }}
        />
      </header>
      <main>{children}</main>
    </div>
  );
};

export default BaseLayout;
