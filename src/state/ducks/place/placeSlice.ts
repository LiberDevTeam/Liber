import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '~/state/store';

export type Message = {
  id: string; // UUID
  uid: string;
  text: string;
  attachment?: string; // this is infoHash of torrent file
  timestamp: number;
};

export type Place = {
  id: string;
  name: string;
  description: string;
};

export interface PlaceState {
  messages: Record<string, Message[]>; // Record<cid, Message[]>
  messagesIndex: Record<string, true>; // Record<mid, null> for check duplication of messages
}

const initialState: PlaceState = {
  messages: {},
  messagesIndex: {},
};

export const placeSlice = createSlice({
  name: 'place',
  initialState,
  reducers: {
    addMessage: (
      state,
      action: PayloadAction<{ cid: string; message: Message }>
    ) => {
      const { cid, message } = action.payload;
      state.messages[cid] = [message].concat(state.messages[cid] || []);
      state.messagesIndex[message.id] = true;
    },
    setPlaceMessages: (
      state,
      action: PayloadAction<{ cid: string; messages: Message[] }>
    ) => {
      const { cid, messages } = action.payload;
      if (!messages) {
        state.messages[cid] = [];
        state.messagesIndex = {};
        return;
      }
      Object.values(messages).sort((a, b) =>
        a.timestamp > b.timestamp ? -1 : 1
      );
      state.messages[cid] = messages;
      state.messagesIndex = messages.reduce((prev, message) => {
        return { ...prev, [message.id]: true };
      }, {});
    },
  },
});

export const { addMessage, setPlaceMessages } = placeSlice.actions;

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
export const selectPlaceMessages = (cid: string) => (
  state: RootState
): Message[] => state.place.messages[cid] || [];

export default placeSlice.reducer;
