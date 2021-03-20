import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
  EntityId,
} from '@reduxjs/toolkit';
import {
  placeMessageAdded,
  placeAdded,
  leftPlace,
  placeMessagesAdded,
} from '~/state/actionCreater';
import { RootState } from '~/state/store';
import { Message, selectMessageById } from './messagesSlice';

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
  hash?: string;
  // orbit db id
  feedAddress: string;
  keyValAddress: string;
}

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeMessageAdded, (state, action) => {
        const { pid, message, mine } = action.payload;
        const place = { ...state.entities[pid] };
        place.messageIds = [...(place.messageIds || []), message.id];
        if (mine === false) {
          place.unreadMessages = place.unreadMessages
            ? [...place.unreadMessages, message.id]
            : [message.id];
        }
        placesAdapter.updateOne(state, { id: pid, changes: place });
      })
      .addCase(placeMessagesAdded, (state, action) => {
        const place = state.entities[action.payload.placeId];

        if (place) {
          const ids = action.payload.messages.map((message) => message.id);
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
      })
      .addCase(leftPlace, (state, action) => {
        placesAdapter.removeOne(state, action.payload.pid);
      });
  },
});

// export const { } = placesSlice.actions;

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

export const { clearUnreadMessages, setHash } = placesSlice.actions;

export default placesSlice.reducer;
