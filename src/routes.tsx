import { ConnectedRouter, push } from 'connected-react-router';
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import IndexPage from './pages';
import { NewPlace } from './pages/places/new';
import { history, AppThunkDispatch } from './state/store';
import { Places } from './pages/places';
import { NotFoundPage } from './pages/404';
import { useDispatch } from 'react-redux';
import { initNodes, joinPlace } from './state/ducks/p2p/p2pSlice';
import { useParams } from 'react-router-dom';

type RootParams = {
  pid?: string;
  peerId?: string;
  swarmId?: string;
};

export const Routes: React.FC = () => (
  <ConnectedRouter history={history}>
    <Initializer />
    {/* your usual react-router-dom v4/v5 routing */}
    <Switch>
      <Route exact path="/" render={() => <IndexPage />} />
      <Route exact path="/places/new" render={() => <NewPlace />} />
      <Route path="/places/:pid?/:swarmKey?" render={() => <Places />} />
      <Route render={() => <NotFoundPage />} />
    </Switch>
  </ConnectedRouter>
);

function Initializer() {
  const dispatch: AppThunkDispatch = useDispatch();
  const { pid, peerId, swarmId } = useParams<RootParams>();

  useEffect(() => {
    (async () => {
      await dispatch(initNodes());
      if (pid && peerId && swarmId) {
        await dispatch(joinPlace({ peerId, pid, swarmId }));
      }
    })();
  }, [pid, peerId, swarmId, dispatch]);

  return null;
}
