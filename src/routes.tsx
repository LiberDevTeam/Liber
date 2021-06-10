import { ConnectedRouter } from 'connected-react-router';
import React, { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { setupBotWorker } from '~/state/bots/botsSlice';
import { initUser } from '~/state/me/meSlice';
import { initApp } from '~/state/p2p/p2pSlice';
import { useAppSelector } from './hooks';
import { NotFoundPage } from './pages/404';
import { BotDetailPage } from './pages/bots/detail';
import { BotEditPage } from './pages/bots/edit';
import { BotsPage } from './pages/bots/index';
import { BotNewPage } from './pages/bots/new';
import { Explore } from './pages/explore';
import { HomePage } from './pages/home';
import { LoadingPage } from './pages/loading';
import { MarketplacePage } from './pages/marketplace';
import { NotificationsPage } from './pages/notifications';
import { BannedUsers } from './pages/places/banned-users';
import { ChatDetail } from './pages/places/detail';
import { PlaceEdit } from './pages/places/edit';
import { Places } from './pages/places/index';
import { NewPlace } from './pages/places/new';
import { ProfilePage } from './pages/profile';
import { ProfileEditPage } from './pages/profile/edit';
import { SettingsPage } from './pages/settings';
import { StickerDetailPage } from './pages/stickers/detail';
import { StickerEditPage } from './pages/stickers/edit';
import { StickersPage } from './pages/stickers/index';
import { StickerNewPage } from './pages/stickers/new';
import { TrackerProvider } from './state/contexts/tracker';
import { AppThunkDispatch, history } from './state/store';

export const Routes: React.FC = memo(function Routes() {
  const dispatch: AppThunkDispatch = useDispatch();
  const isInitialized = useAppSelector((state) => state.isInitialized);

  useEffect(() => {
    dispatch(initUser()).then(() => {
      dispatch(initApp());
    });
    dispatch(setupBotWorker());
  }, [dispatch]);

  if (isInitialized === false) {
    return <LoadingPage text="Loading..." />;
  }

  return (
    <ConnectedRouter history={history}>
      <TrackerProvider>
        {/* your usual react-router-dom v4/v5 routing */}
        <Switch>
          <Route exact path="/" render={() => <HomePage />} />

          <Route exact path="/places/new" render={() => <NewPlace />} />
          <Route exact path="/places" render={() => <Places />} />
          <Route
            exact
            path="/places/:address/:placeId/banned-users"
            render={() => <BannedUsers />}
          />

          <Route
            exact
            path="/places/:address/:placeId/bots"
            render={() => <ChatDetail />}
          />
          <Route
            exact
            path="/places/:address/:placeId/edit"
            render={() => <PlaceEdit />}
          />
          <Route
            exact
            path="/places/:address/:placeId/:swarmKey?"
            render={() => <ChatDetail />}
          />

          <Route exact path="/explore" render={() => <Explore />} />

          <Route exact path="/profile" render={() => <ProfilePage />} />
          <Route
            exact
            path="/profile/edit"
            render={() => <ProfileEditPage />}
          />

          <Route
            exact
            path="/marketplace/:type?"
            render={() => <MarketplacePage />}
          />

          <Route exact path="/bots/new" render={() => <BotNewPage />} />
          <Route
            exact
            path="/bots/:address/:botId"
            render={() => <BotDetailPage />}
          />
          <Route
            exact
            path="/bots/:address/:botId/edit"
            render={() => <BotEditPage />}
          />
          <Route exact path="/bots" render={() => <BotsPage />} />

          <Route exact path="/stickers/new" render={() => <StickerNewPage />} />
          <Route
            exact
            path="/stickers/:address/:stickerId"
            render={() => <StickerDetailPage />}
          />
          <Route
            exact
            path="/stickers/:address/:stickerId/edit"
            render={() => <StickerEditPage />}
          />
          <Route exact path="/stickers" render={() => <StickersPage />} />

          <Route exact path="/settings" render={() => <SettingsPage />} />

          <Route
            exact
            path="/notifications"
            render={() => <NotificationsPage />}
          />

          <Route exact path="/404" render={() => <NotFoundPage />} />
          <Route render={() => <NotFoundPage />} />
        </Switch>
      </TrackerProvider>
    </ConnectedRouter>
  );
});
