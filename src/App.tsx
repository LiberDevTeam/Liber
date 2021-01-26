import React, { useEffect } from 'react';
import ChannelPage from './pages/channels/[cid]';
import NewChannel from './pages/channels/new';
import { selectMe } from './state/ducks/me/meSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { history } from './state/store';
import { connect } from './connection';
import IndexPage from './pages';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);

  // TODO use server notification to trigger to connect.
  useEffect(() => {
    dispatch(connect(`ws://192.168.10.101:3000/ws?uid=${me.id}`, me));
  }, []);

  return (
    <div className="App">
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
