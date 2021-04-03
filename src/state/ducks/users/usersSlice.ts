import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

export interface User {
  id: string;
  username?: string;
  avatarCid?: string;
}

export interface UsersState {
  users: User[];
}

const usersAdapter = createEntityAdapter<User>();

export const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState(),
  reducers: {
    addUser: (state, action: PayloadAction<User>) =>
      usersAdapter.addOne(state, action.payload),
    removeUser: (state, action: PayloadAction<{ id: string }>) =>
      usersAdapter.removeOne(state, action.payload.id),
  },
});

export const { addUser, removeUser } = usersSlice.actions;

export const selectUserById = usersAdapter.getSelectors().selectById;

export default usersSlice.reducer;
