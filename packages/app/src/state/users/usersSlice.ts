import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { connectUserDB } from '~/lib/db/user';
import { RootState } from '../store';
import { User } from './type';

const usersAdapter = createEntityAdapter<User>();

export const fetchUserData = async (userId: string): Promise<User> => {
  const user = await connectUserDB({ userId });
  return user.get('data');
};

export const loadUsers = createAsyncThunk<User[], { userIds: string[] }>(
  'users/load',
  async ({ userIds }) => {
    return (
      await Promise.all(userIds.map((userId) => fetchUserData(userId)))
    ).filter(Boolean);
  }
);

export const loadUser = createAsyncThunk<User, { uid: string }>(
  'users/loadOne',
  async ({ uid }) => {
    return fetchUserData(uid);
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
      .addCase(loadUsers.pending, (state, action) => {
        // TODO: add implementations
      })
      .addCase(loadUsers.rejected, (state, action) => {
        // TODO: add implementations
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        usersAdapter.addMany(state, action.payload);
      })
      .addCase(loadUser.pending, (state, action) => {
        // TODO: add implementations
      })
      .addCase(loadUser.rejected, (state, action) => {
        // TODO: add implementations
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        usersAdapter.addOne(state, action.payload);
      });
  },
});

const { selectById, selectAll } = usersAdapter.getSelectors();
export const selectUserById = selectById;
export const selectAllUsers = selectAll;

export const selectUsersByIds =
  (ids: string[]) =>
  (state: RootState): User[] => {
    return ids
      .map((id) => selectUserById(state.users, id))
      .filter(Boolean) as User[];
  };