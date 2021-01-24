import React, { useEffect } from 'react';
import ChannelPage from './pages/channels/[cid]';
import NewChannel from './pages/channels/new';
import { selectMe } from './state/ducks/me/meSlice';
import {
  selectApplication,
  toggleDrawer,
} from './state/ducks/application/applicationSlice';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter, push } from 'connected-react-router';
import { history } from './state/store';
import { connect } from './connection';
import { rtcCreateOffer } from './connection/actions';
import IndexPage from './pages';
import Navbar from './components/organisms/navbar';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const app = useSelector(selectApplication);

  // TODO use server notification to trigger to connect.
  useEffect(() => {
    dispatch(connect(`ws://192.168.10.101:3000/ws?uid=${me.id}`, me));
  }, []);

  return (
    <div className="App">
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
      <ConnectedRouter history={history}>
        <>
          {/* your usual react-router-dom v4/v5 routing */}
          <Switch>
            <Route exact path="/" render={() => <IndexPage />} />
            <Route exact path="/channels/new" render={() => <NewChannel />} />
            <Route exact path="/channels/:cid" render={() => <ChannelPage />} />
          </Switch>
        </>
      </ConnectedRouter>
    </div>
  );
};

export default App;
