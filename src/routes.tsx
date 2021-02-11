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
import { useLocation } from 'react-router-dom';

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

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Initializer() {
  const dispatch: AppThunkDispatch = useDispatch();

  const query = useQuery();
  const pid = query.get('pid');
  const peerId = query.get('peerId');

  useEffect(() => {
    (async () => {
      await dispatch(initNodes());
      pid &&
        peerId &&
        (await dispatch(
          joinPlace({ peerId, pid, swarmId: query.get('swarmId') })
        ));
    })();
  }, [dispatch]);

  return null;
}
