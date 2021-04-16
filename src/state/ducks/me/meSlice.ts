import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '~/state/store';
import { addIpfsContent } from '../p2p/ipfsContentsSlice';
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

export const updateProfile = createAsyncThunk<
  void,
  { avatar: File | null; username: string },
  { dispatch: AppDispatch }
>('me/updateProfile', async ({ avatar, username }, { dispatch }) => {
  if (!avatar) {
    dispatch(profileUpdated({ username, avatarCid: '' }));
    return;
  }

  const avatarCid = await addIpfsContent(dispatch, avatar);
  dispatch(profileUpdated({ username, avatarCid }));
});

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
    profileUpdated: (
      state,
      action: PayloadAction<{ username: string; avatarCid: string }>
    ) => {
      state.username = action.payload.username;
      state.avatarCid = action.payload.avatarCid;
    },
  },
});

export const {
  updateIsolationMode,
  updateId,
  profileUpdated,
} = meSlice.actions;

export const selectMe = (state: RootState): typeof state.me => state.me;

export default meSlice.reducer;
