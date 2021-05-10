import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { connectUserDB } from '../../../lib/db/user';

export interface Settings {
  isIsolation: boolean;
}

export interface User {
  id: string;
  username?: string;
  avatarCid?: string;
  settings: Settings;
}

const usersAdapter = createEntityAdapter<User>();

export const fetchUserData = async (userId: string): Promise<User> => {
  const user = await connectUserDB({ userId });
  return user.get('data');
};

export const loadUsers = createAsyncThunk<User[], { userIds: string[] }>(
  'users/load',
  async ({ userIds }) => {
    return await Promise.all(userIds.map((userId) => fetchUserData(userId)));
  }
);

export const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState<{
    loading: Record<string, boolean>;
  }>({
    loading: {},
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending, (state, action) => {})
      .addCase(loadUsers.rejected, (state, action) => {})
      .addCase(loadUsers.fulfilled, (state, action) => {
        usersAdapter.addMany(state, action.payload);
      });
  },
});

const { selectById } = usersAdapter.getSelectors();
export const selectUserById = selectById;
