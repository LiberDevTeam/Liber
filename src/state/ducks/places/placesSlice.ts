import {
  createEntityAdapter,
  createSlice,
  EntityId,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  placeAdded,
  placeMessageAdded,
  placeMessagesAdded,
} from '~/state/actionCreater';
import { RootState } from '~/state/store';
import { Message, selectMessageById } from './messagesSlice';

export const categories = [
  'DISCUSSION_AND_STORIES',
  'EMOTIONAL_REACTION_FUEL',
  'ENTERTAINMENT_GAMING',
  'ENTERTAINMENT_TELEVISION',
  'ENTERTAINMENT_OTHER',
  'HUMOR',
  'IMAGES_GIFS_AND_VIDEOS',
  'LEARNING_AND_THINKING',
  'LIFESTYLE_AND_HELP',
  'NEWS_AND_ISSUES',
  'TRAVEL',
  'RACE_GENDER_AND_IDENTITY',
  'SPORTS',
  'TECHNOLOGY',
];

export enum PlacePermission {
  NONE,
  AUTHOR,
  ADMIN,
  WRITER,
  MODERATOR,
}

// UserId: PlacePermission
export type PlacePermissions = Record<string, PlacePermission>;

export interface PlaceInfo {
  id: string;
  name: string;
  description: string;
  avatarCid: string;
  passwordRequired: boolean;
  readOnly: boolean;
  createdAt: number;
  category: number;
}

export interface Place extends PlaceInfo {
  swarmKey?: string;
  invitationUrl: string;
  timestamp: number; // the timestamp any user in the place acted at
  messageIds: string[];
  unreadMessages: string[];
  hash?: string;
  permissions: PlacePermissions;
  // orbit db id
  feedAddress: string;
  keyValAddress: string;
}

const messageSort = (a: Message, b: Message): number =>
  a.timestamp - b.timestamp;

const placesAdapter = createEntityAdapter<Place>({
  sortComparer: (a, b) => a.timestamp - b.timestamp,
});

export const placesSlice = createSlice({
  name: 'places',
  initialState: placesAdapter.getInitialState(),
  reducers: {
    clearUnreadMessages(state, action: PayloadAction<string>) {
      const place = state.entities[action.payload];
      if (place) {
        place.unreadMessages = [];
      }
    },
    setHash(state, action: PayloadAction<{ placeId: string; hash: string }>) {
      const { placeId, hash } = action.payload;
      const place = state.entities[placeId];
      if (place) {
        place.hash = hash;
      }
    },
    removePlace(state, action: PayloadAction<{ pid: string }>) {
      placesAdapter.removeOne(state, action.payload.pid);
      // TODO expire the messages in the place user left
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeMessageAdded, (state, action) => {
        const { pid, message, mine } = action.payload;
        const currentPlace = state.entities[pid];
        if (currentPlace === undefined) {
          throw new Error('Place is not exists');
        }
        const newPlace: Place = { ...currentPlace };
        newPlace.messageIds = [...(newPlace.messageIds || []), message.id];
        if (mine === false) {
          newPlace.unreadMessages = newPlace.unreadMessages
            ? [...newPlace.unreadMessages, message.id]
            : [message.id];
        }
        if (newPlace.timestamp < message.timestamp) {
          newPlace.timestamp = message.timestamp;
        }
        placesAdapter.updateOne(state, { id: pid, changes: newPlace });
      })
      .addCase(placeMessagesAdded, (state, action) => {
        const { placeId, messages } = action.payload;
        const place = state.entities[placeId];

        if (place) {
          const ids = messages.sort(messageSort).map((message) => message.id);
          place.messageIds = [...new Set(place.messageIds.concat(ids))];
          place.unreadMessages = [...new Set(place.unreadMessages.concat(ids))];
        }
      })
      .addCase(placeAdded, (state, action) => {
        const { place, messages } = action.payload;
        place.messageIds = messages.map((message) => message.id);
        if (place) {
          placesAdapter.addOne(state, place);
        }
      });
  },
});

const selectors = placesAdapter.getSelectors();
export const selectPlaceById = (id: string) => (
  state: RootState
): Place | undefined => selectors.selectById(state.places, id);

export const selectAllPlaces = (state: RootState): Place[] =>
  selectors.selectAll(state.places);

export const selectPlaceIds = (state: RootState): EntityId[] =>
  selectors.selectIds(state.places);

export const selectPlaceMessagesByPID = (pid: string) => (
  state: RootState
): Message[] => {
  const place = selectors.selectById(state.places, pid);

  if (!place) {
    return [];
  }

  return place.messageIds
    .map((id) => selectMessageById(state.placeMessages, id))
    .filter(Boolean) as Message[];
};

export const {
  clearUnreadMessages,
  setHash,
  removePlace,
} = placesSlice.actions;

export default placesSlice.reducer;
