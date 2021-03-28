import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
  EntityId,
} from '@reduxjs/toolkit';
import {
  placeMessageAdded,
  placeAdded,
  placeMessagesAdded,
} from '~/state/actionCreater';
import { RootState } from '~/state/store';
import { Message, selectMessageById } from './messagesSlice';

export const categories = [
  'Discussion and Stories',
  'Emotional Reaction Fuel',
  'Entertainment - Gaming',
  'Entertainment - Television',
  'Entertainment - Other (Movies/Music/Franchies/Misc)',
  'Humor',
  'Images, Gifs, and Videos',
  'Learning and Thinking',
  'Lifestyle and Help',
  'News and Issues',
  'Travel',
  'Race, Gender, and Identity',
  'Sports',
  'Technology',
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

export interface Place {
  id: string;
  name: string;
  description: string;
  avatarImage: string; // data url
  avatarImageCID: string;
  swarmKey?: string;
  invitationUrl: string;
  timestamp: number; // the timestamp any user in the place acted at
  createdAt: number;
  messageIds: string[];
  unreadMessages: string[];
  passwordRequired: boolean;
  category: number;
  hash?: string;
  permissions: PlacePermissions;
  // orbit db id
  feedAddress: string;
  keyValAddress: string;
}

const messageSort = (a: Message, b: Message): number => a.postedAt - b.postedAt;

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
    leftPlace(state, action: PayloadAction<{ pid: string }>) {
      placesAdapter.removeOne(state, action.payload.pid);
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
        if (newPlace.timestamp < message.postedAt) {
          newPlace.timestamp = message.postedAt;
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

export const { clearUnreadMessages, setHash, leftPlace } = placesSlice.actions;

export default placesSlice.reducer;
