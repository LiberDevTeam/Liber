import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit';
import { Message, placeMessageAdded } from './messagesSlice';

export type Place = {
  id: string;
  name: string;
  description: string;
  avatarImageCID: string;
  swarmKey?: string;
  invitationUrl?: string;
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
export const selectPlaceById = selectors.selectById;
export const selectAllPlaces = selectors.selectAll;

export default placesSlice.reducer;
