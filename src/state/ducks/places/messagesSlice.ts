import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import {
  placeAdded,
  placeMessageAdded,
  placeMessagesAdded,
} from '~/state/actionCreater';

export interface Message {
  id: string; // UUID
  authorId: string;
  authorName?: string;
  postedAt: number;
  text?: string;
  attachmentCidList?: string[];
}

const messagesAdapter = createEntityAdapter<Message>({
  sortComparer: (a, b) => a.postedAt - b.postedAt,
});

export const messagesSlice = createSlice({
  name: 'placeMessages',
  initialState: messagesAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeAdded, (state, action) => {
        messagesAdapter.upsertMany(state, action.payload.messages);
      })
      .addCase(placeMessageAdded, (state, action) => {
        messagesAdapter.addOne(state, action.payload.message);
      })
      .addCase(placeMessagesAdded, (state, action) => {
        messagesAdapter.upsertMany(state, action.payload.messages);
      });
  },
});

// export const { } = messagesSlice.actions;

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

export const selectMessageById = messagesAdapter.getSelectors().selectById;

export default messagesSlice.reducer;
