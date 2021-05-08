import { ConnectedRouter } from 'connected-react-router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { NotFoundPage } from './pages/404';
import { BotsPage } from './pages/bots';
import { BotDetailPage } from './pages/bots/detail';
import { BotNewPage } from './pages/bots/new';
import { Explore } from './pages/explore';
import { HomePage } from './pages/home';
import { MarketplacePage } from './pages/marketplace';
import { NotificationsPage } from './pages/notifications';
import { ChatDetail } from './pages/places/detail';
import { Places } from './pages/places/index';
import { JoinPlace } from './pages/places/join';
import { NewPlace } from './pages/places/new';
import { ProfilePage } from './pages/profile';
import { ProfileEditPage } from './pages/profile/edit';
import { SettingsPage } from './pages/settings';
import { StickersPage } from './pages/stickers';
import { StickerDetailPage } from './pages/stickers/detail';
import { StickerNewPage } from './pages/stickers/new';
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
        <Route path="/places/:pid/:swarmKey?" render={() => <ChatDetail />} />
        <Route path="/places/:pid/bots" render={() => <ChatDetail />} />
        <Route
          path="/places/:pid/users/maintainers"
          render={() => <ChatDetail />}
        />
        <Route path="/places/:pid/users/banned" render={() => <ChatDetail />} />

        <Route path="/explore/:tab?" render={() => <Explore />} />

        <Route exact path="/profile" render={() => <ProfilePage />} />
        <Route exact path="/profile/edit" render={() => <ProfileEditPage />} />

        <Route path="/marketplace/:kind" render={() => <MarketplacePage />} />

        <Route exact path="/bots/new" render={() => <BotNewPage />} />
        <Route path="/bots/:id" render={() => <BotDetailPage />} />
        <Route exact path="/bots" render={() => <BotsPage />} />

        <Route exact path="/stickers/new" render={() => <StickerNewPage />} />
        <Route path="/stickers/:id" render={() => <StickerDetailPage />} />
        <Route exact path="/stickers" render={() => <StickersPage />} />

        <Route exact path="/settings" render={() => <SettingsPage />} />

        <Route
          exact
          path="/notifications"
          render={() => <NotificationsPage />}
        />

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
