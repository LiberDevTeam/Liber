import { ConnectedRouter } from 'connected-react-router';
import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import IndexPage from './pages';
import { NewPlace } from './pages/places/new';
import { history, AppThunkDispatch } from './state/store';
import { Places } from './pages/places';
import { NotFoundPage } from './pages/404';
import { useDispatch } from 'react-redux';
import { initNodes, joinPlace } from './state/ducks/p2p/p2pSlice';
import { SettingsPage } from './pages/settings';
import { TrackerProvider } from './state/contexts/tracker';

type QueryParams = {
  pid?: string;
  pubKey?: string;
  swarmKey?: string;
  addrs?: string[]; // multiaddrs
};

// A custom hook that builds on useLocation to parse
// the query string.
function useQuery<T extends { [K in keyof T]?: string | string[] }>(): T {
  const { search } = useLocation();

  return React.useMemo(() => {
    const query = new URLSearchParams(search);
    return Array.from(query.keys()).reduce((result, key) => {
      const value = query.getAll(key);
      return {
        ...result,
        [key]: (value.length === 1 ? value[0] : value) || undefined,
      };
    }, {} as T);
  }, [search]);
}

export const Routes: React.FC = () => (
  <ConnectedRouter history={history}>
    <Initializer />
    <TrackerProvider>
      {/* your usual react-router-dom v4/v5 routing */}
      <Switch>
        <Route exact path="/" render={() => <IndexPage />} />
        <Route exact path="/places/new" render={() => <NewPlace />} />
        <Route path="/places/:pid?/:swarmKey?" render={() => <Places />} />
        <Route exact path="/settings" render={() => <SettingsPage />} />
        <Route render={() => <NotFoundPage />} />
      </Switch>
    </TrackerProvider>
  </ConnectedRouter>
);

function Initializer() {
  const dispatch: AppThunkDispatch = useDispatch();
  const { pid, pubKey, swarmKey, addrs } = useQuery<QueryParams>();

  useEffect(() => {
    (async () => {
      await dispatch(initNodes());
      if (pid && pubKey && addrs) {
        await dispatch(joinPlace({ pubKey, pid, swarmKey, addrs }));
      }
    })();
  }, [dispatch, pid, pubKey, addrs, swarmKey]);

  return null;
}
