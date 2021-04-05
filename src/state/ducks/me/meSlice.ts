import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '~/state/store';
import { User } from '../users/usersSlice';

export interface Settings {
  isIsolation: boolean;
}

export interface Me extends User {
  settings: Settings;
}

export type MeState = Me;

const initialState: MeState = {
  id: '',
  username: '',
  settings: {
    isIsolation: false,
  },
  avatarCid: '',
};

export const meSlice = createSlice({
  name: 'me',
  initialState,
  reducers: {
    updateId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    updateIsolationMode: (state, action: PayloadAction<boolean>) => {
      state.settings.isIsolation = action.payload;
    },
    updateUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
  },
});

export const {
  updateIsolationMode,
  updateId,
  updateUsername,
} = meSlice.actions;

export const selectMe = (state: RootState): typeof state.me => state.me;

export default meSlice.reducer;
