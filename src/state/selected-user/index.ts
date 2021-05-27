import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SelectedUser = string | null;

export const selectedUserSlice = createSlice({
  initialState: null as SelectedUser,
  name: 'selectedUser',
  reducers: {
    set(_, action: PayloadAction<string>) {
      return action.payload;
    },
    clear() {
      return null;
    },
  },
});

const { clear, set } = selectedUserSlice.actions;

export const clearSelectedUser = clear;
export const setSelectedUser = set;
