import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '~/state/store';
import { connectUserDB, createUserDB } from '../../../lib/db/user';
import { addIpfsContent } from '../p2p/ipfsContentsSlice';
import { User } from '../users/usersSlice';

const initialState: User = {
  id: '',
  username: '',
  settings: {
    isIsolation: false,
  },
  avatarCid: '',
};

const DB_KEY = 'data';

export const initUser = createAsyncThunk<User, void, { state: RootState }>(
  'me/init',
  async (_0, { getState }) => {
    const me = getState().me;
    if (me.id) {
      const userDB = await connectUserDB({ userId: me.id });
      return userDB.get(DB_KEY);
    }

    const userDB = await createUserDB();

    const user: User = {
      id: userDB.address.root,
      username: 'Unnamed',
      avatarCid: '',
      settings: {
        isIsolation: false,
      },
    };

    userDB.set(DB_KEY, user);

    return user;
  }
);

export const updateProfile = createAsyncThunk<
  User,
  { avatar: File | null; username: string },
  { dispatch: AppDispatch; state: RootState }
>('me/updateProfile', async ({ avatar, username }, { dispatch, getState }) => {
  const me = getState().me;
  const userDB = await connectUserDB({ userId: me.id });

  let avatarCid = me.avatarCid;

  if (avatar) {
    avatarCid = await addIpfsContent(dispatch, avatar);
  }

  const newProfile = { ...me, username, avatarCid };
  userDB.set(DB_KEY, newProfile);
  return newProfile;
});

export const meSlice = createSlice({
  name: 'me',
  initialState,
  reducers: {
    updateIsolationMode: (state, action: PayloadAction<boolean>) => {
      state.settings.isIsolation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initUser.fulfilled, (state, action) => action.payload)
      .addCase(updateProfile.fulfilled, (state, action) => action.payload);
  },
});

export const { updateIsolationMode } = meSlice.actions;

export const selectMe = (state: RootState): typeof state.me => state.me;

export default meSlice.reducer;
