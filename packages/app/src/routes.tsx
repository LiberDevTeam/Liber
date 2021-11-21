import React, { memo, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ManageBotsPage } from '~/pages/places/manage-bots';
import { initMe } from '~/state/me/meSlice';
import { initApp } from '~/state/p2p/p2pSlice';
import { useAppDispatch, useAppSelector } from './hooks';
import { NotFoundPage } from './pages/404';
import { BotDetailPage } from './pages/bots/detail';
import { BotEditPage } from './pages/bots/edit';
import { Bots } from './pages/bots/index';
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

export const AppRoutes: React.FC = memo(function AppRoutes() {
  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector((state) => state.isInitialized);

  useEffect(() => {
    dispatch(initMe()).then(() => {
      dispatch(initApp());
    });
  }, [dispatch]);

  if (isInitialized === false) {
    return <LoadingPage text="Loading..." />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="places">
        <Route path="new" element={<NewPlace />} />
        <Route index element={<Places />} />
      </Route>

      <Route path="places/:address/:placeId">
        <Route index element={<ChatDetail />} />
        <Route path="banned-users" element={<BannedUsers />} />
        <Route path="manage-bots" element={<ManageBotsPage />} />
        <Route path="edit" element={<PlaceEdit />} />
      </Route>

      <Route path="explore" element={<Explore />} />

      <Route path="profile">
        <Route index element={<ProfilePage />} />
        <Route path="edit" element={<ProfileEditPage />} />
      </Route>

      <Route path="marketplace" element={<MarketplacePage />}>
        <Route index element={<MarketplacePage />} />
        <Route path=":type" element={<MarketplacePage />} />
      </Route>

      <Route path="bots">
        <Route index element={<Bots />} />
        <Route path="new" element={<BotNewPage />} />
        <Route path=":address/:botId">
          <Route index element={<BotDetailPage />} />
          <Route path="edit" element={<BotEditPage />} />
        </Route>
      </Route>

      <Route path="stickers/new" element={<StickerNewPage />} />
      <Route
        path="stickers/:address/:stickerId"
        element={<StickerDetailPage />}
      />
      <Route
        path="stickers/:address/:stickerId/edit"
        element={<StickerEditPage />}
      />
      <Route path="stickers" element={<StickersPage />} />

      <Route path="settings" element={<SettingsPage />} />

      <Route path="notifications" element={<NotificationsPage />} />

      <Route path="/404" element={<NotFoundPage />} />
      <Route element={<NotFoundPage />} />
    </Routes>
  );
});
