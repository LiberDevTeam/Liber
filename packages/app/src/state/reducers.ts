import { combineReducers } from 'redux';
import botsReducer from '~/state/bots/botsSlice';
import { connectedMessage } from '~/state/connectedMessage';
import feedReducer from '~/state/feed/feedSlice';
import marketplaceBotsReducer from '~/state/marketplace/botsSlice';
import marketplaceStickersReducer from '~/state/marketplace/stickersSlice';
import meReducer from '~/state/me/meSlice';
import ipfsContentsReducer from '~/state/p2p/ipfsContentsSlice';
import placeMessagesReducer from '~/state/places/messagesSlice';
import placesReducer from '~/state/places/placesSlice';
import searchReducer from '~/state/search/searchSlice';
import { selectedUserSlice } from '~/state/selected-user';
import stickersReducer from '~/state/stickers/stickersSlice';
import { usersSlice } from '~/state/users/usersSlice';
import { isInitializedSlice } from './isInitialized';

export const reducers = combineReducers({
  me: meReducer,
  places: placesReducer,
  placeMessages: placeMessagesReducer,
  ipfsContents: ipfsContentsReducer,
  feed: feedReducer,
  users: usersSlice.reducer,
  search: searchReducer,
  bots: botsReducer,
  stickers: stickersReducer,
  marketplaceBots: marketplaceBotsReducer,
  marketplaceStickers: marketplaceStickersReducer,
  selectedUser: selectedUserSlice.reducer,
  isInitialized: isInitializedSlice.reducer,
  connectedMessage: connectedMessage.reducer,
});
