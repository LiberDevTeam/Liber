import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { v4 as uuidv4 } from 'uuid';
import { Channel } from '../channel/channelSlice';

export type Me = {
  id: string;
  username: string;
  channels: Record<string, Channel>;
};

export type MeState = Me;

const initialState: MeState = {
  id: uuidv4(),
  username: 'username',
  channels: {},
};

export const meSlice = createSlice({
  name: 'me',
  initialState,
  reducers: {
    addChannel: (state, action: PayloadAction<Channel>) => {
      const { id, name, description } = action.payload;
      state.channels[action.payload.id] = { id, name, description };
    },
    updateUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
  },
});

export const { addChannel, updateUsername } = meSlice.actions;

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
export const selectMe = (state: RootState): typeof state.me => state.me;

export default meSlice.reducer;
