import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import IndexPage from './pages';
import { NewPlace } from './pages/places/new';
import { history } from './state/store';
import { Places } from './pages/places';
import { NotFoundPage } from './pages/404';

export const Routes: React.FC = () => (
  <ConnectedRouter history={history}>
    {/* your usual react-router-dom v4/v5 routing */}
    <Switch>
      <Route exact path="/" render={() => <IndexPage />} />
      <Route exact path="/places/new" render={() => <NewPlace />} />
      <Route path="/places/:cid?" render={() => <Places />} />
      <Route render={() => <NotFoundPage />} />
    </Switch>
  </ConnectedRouter>
);
