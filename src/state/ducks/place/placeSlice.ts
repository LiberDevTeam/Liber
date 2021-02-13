import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '~/state/store';

export const MESSAGE_TYPE = {
  MediaFile: 'MediaFile',
  Text: 'Text',
  Initial: 'Initial',
} as const;
type MESSAGE_TYPE = typeof MESSAGE_TYPE[keyof typeof MESSAGE_TYPE];

export type Message = {
  id: string; // UUID
  type: MESSAGE_TYPE;
  uid: string; // UUID
  timestamp: number;
  text?: string;
  fileUrl?: string;
  messageHistory?: Message[]; // the list of messages posted recently
  place?: Place;
};

export type Place = {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  swarmKey?: string;
};

export interface PlaceState {
  messages: Record<string, Message[]>;
  places: Record<string, Place>;
}

const initialState: PlaceState = {
  messages: {},
  places: {},
};

export const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    setMessages: (
      state,
      action: PayloadAction<{ pid: string; messages: Message[] }>
    ) => {
      const { pid, messages } = action.payload;
      state.messages[pid] = messages || [];
    },
    addPlace: (state, action: PayloadAction<Place>) => {
      state.places[action.payload.id] = { ...action.payload };
    },
    addMessage: (
      state,
      action: PayloadAction<{ pid: string; message: Message }>
    ) => {
      const { pid, message } = action.payload;
      state.messages[pid] = (state.messages[pid] || []).concat(message || []);
    },
  },
});

export const { addPlace, setMessages, addMessage } = placesSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = (amount: number): AppThunk => dispatch => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state: RootState) => state.counter.value;
export const selectPlace = (state: RootState): typeof state.place =>
  state.place;
export const selectPlaces = (state: RootState) => state.place.places;
export const selectPlaceById = (pid: string | null) => (state: RootState) =>
  state.place.places[pid || ''];
export const selectPlaceMessages = (pid: string) => (
  state: RootState
): Message[] => state.place.messages[pid] || [];

export default placesSlice.reducer;
