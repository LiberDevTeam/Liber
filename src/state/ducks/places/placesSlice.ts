import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '~/state/store';
import { Message, placeMessageAdded, selectMessageById } from './messagesSlice';

export type Place = {
  id: string;
  name: string;
  description: string;
  avatarImage: string;
  avatarImageCID: string;
  swarmKey?: string;
  invitationUrl: string;
  lastActedAt: number;
  createdAt: number;
  messageIds: string[];
};

const placesAdapter = createEntityAdapter<Place>({
  sortComparer: (a, b) => a.lastActedAt - b.lastActedAt,
});

export const placesSlice = createSlice({
  name: 'places',
  initialState: placesAdapter.getInitialState(),
  reducers: {
    placeAdded: (
      state,
      action: PayloadAction<{ place: Place; messages: Message[] }>
    ) => {
      const { place, messages } = action.payload;
      place.messageIds = messages.map((m) => m.id);
      placesAdapter.addOne(state, place);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(placeMessageAdded, (state, action) => {
      const { pid, message } = action.payload;
      const place = { ...state.entities[pid] };
      place.messageIds = [...place.messageIds, message.id];
      placesAdapter.updateOne(state, { id: pid, changes: place });
    });
  },
});

export const { placeAdded } = placesSlice.actions;

const selectors = placesAdapter.getSelectors();
export const selectPlaceById = (id: string) => (state: RootState) =>
  selectors.selectById(state.places, id);
export const selectAllPlaces = (state: RootState) =>
  selectors.selectAll(state.places);
export const selectPlaceMessagesByPID = (pid: string) => (state: RootState) =>
  selectors
    .selectById(state.places, pid)
    ?.messageIds.map((id) => selectMessageById(state.placeMessages, id))
    .filter((m): m is Message => typeof m === 'object') || [];

export default placesSlice.reducer;
