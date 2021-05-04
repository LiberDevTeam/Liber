import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NotFoundPage } from './pages/404';
import { BotsPage } from './pages/bots';
import { BotDetailPage } from './pages/bots/detail';
import { BotNewPage } from './pages/bots/new';
import { Explore } from './pages/explore';
import { HomePage } from './pages/home';
import { MarketplaceBotsPage } from './pages/marketplace/bots';
import { MarketplaceStickersPage } from './pages/marketplace/stickers';
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
import { history } from './state/store';

export const Routes: React.FC = () => (
  <ConnectedRouter history={history}>
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

        <Route
          exact
          path="/marketplace/bots"
          render={() => <MarketplaceBotsPage />}
        />
        <Route
          exact
          path="/marketplace/stickers"
          render={() => <MarketplaceStickersPage />}
        />

        <Route exact path="/bots/new" render={() => <BotNewPage />} />
        <Route path="/bots/:id" render={() => <BotDetailPage />} />
        <Route exact path="/bots" render={() => <BotsPage />} />

        <Route exact path="/stickers/:tab" render={() => <StickersPage />} />
        <Route exact path="/stickers/new" render={() => <StickerNewPage />} />
        <Route path="/stickers/:id" render={() => <StickerDetailPage />} />

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
