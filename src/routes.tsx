import { ConnectedRouter } from 'connected-react-router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { NotFoundPage } from './pages/404';
import { Explore } from './pages/explore';
import { HomePage } from './pages/home';
import { ChatDetail } from './pages/places/detail';
import { Places } from './pages/places/index';
import { JoinPlace } from './pages/places/join';
import { NewPlace } from './pages/places/new';
import { ProfilePage } from './pages/profile';
import { ProfileEditPage } from './pages/profile/edit';
import { SettingsPage } from './pages/settings';
import { TrackerProvider } from './state/contexts/tracker';
import { initApp } from './state/ducks/p2p/p2pSlice';
import { AppThunkDispatch, history } from './state/store';

export const Routes: React.FC = () => (
  <ConnectedRouter history={history}>
    <Initializer />
    <TrackerProvider>
      {/* your usual react-router-dom v4/v5 routing */}
      <Switch>
        <Route exact path="/" render={() => <HomePage />} />
        <Route exact path="/places/new" render={() => <NewPlace />} />
        <Route path="/places" exact render={() => <Places />} />
        <Route
          path="/places/:placeId/join/:address"
          render={() => <JoinPlace />}
        />
        <Route path="/explore/:tab?" render={() => <Explore />} />
        <Route path="/places/:pid?/:swarmKey?" render={() => <ChatDetail />} />
        <Route path="/explore/:tab?" render={() => <Explore />} />
        <Route exact path="/profile" render={() => <ProfilePage />} />
        <Route exact path="/profile/edit" render={() => <ProfileEditPage />} />
        <Route exact path="/settings" render={() => <SettingsPage />} />
        <Route render={() => <NotFoundPage />} />
      </Switch>
    </TrackerProvider>
  </ConnectedRouter>
);

function Initializer() {
  const dispatch: AppThunkDispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(initApp());
    })();
  }, [dispatch]);

  return null;
}
