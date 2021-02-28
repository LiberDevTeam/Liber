import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  placeMessageAdded,
  placeAdded,
  leftPlace,
} from '~/state/actionCreater';
import { RootState } from '~/state/store';
import { Message, selectMessageById } from './messagesSlice';

export type Place = {
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
};

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeMessageAdded, (state, action) => {
        const { pid, message } = action.payload;
        const place = { ...state.entities[pid] };
        place.messageIds = [...place.messageIds, message.id];
        place.unreadMessages = place.unreadMessages
          ? [...place.unreadMessages, message.id]
          : [message.id];
        placesAdapter.updateOne(state, { id: pid, changes: place });
      })
      .addCase(placeAdded, (state, action) => {
        const { place, messages } = action.payload;
        place.messageIds = messages.map((m) => m.id);
        placesAdapter.addOne(state, place);
      })
      .addCase(leftPlace, (state, action) =>
        placesAdapter.removeOne(state, action.payload.pid)
      );
  },
});

// export const { } = placesSlice.actions;

const selectors = placesAdapter.getSelectors();
export const selectPlaceById = (id: string) => (state: RootState) =>
  selectors.selectById(state.places, id);
export const selectAllPlaces = (state: RootState) =>
  selectors.selectAll(state.places);
export const selectPlaceMessagesByPID = (pid: string) => (state: RootState) => {
  const place = selectors.selectById(state.places, pid);
  return place ? selectPlaceMessages(place)(state) : [];
};
export const selectPlaceMessages = (place: Place) => (state: RootState) =>
  place.messageIds
    .map((id) => selectMessageById(state.placeMessages, id))
    .filter((m): m is Message => typeof m === 'object') || [];

export const { clearUnreadMessages } = placesSlice.actions;

export default placesSlice.reducer;
