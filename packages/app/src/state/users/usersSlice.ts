import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { AppDB } from '~/lib/db';
import { RootState, ThunkExtra } from '../store';
import { User } from './type';

const usersAdapter = createEntityAdapter<User>();

export const connectUserDB = async (
  userId: string,
  db: AppDB
): Promise<User> => {
  const user = await db.user.connect({ userId });
  return user.get('data');
};

export const loadUsers = createAsyncThunk<
  User[],
  { userIds: string[] },
  { extra: ThunkExtra }
>('users/load', async ({ userIds }, { extra }) => {
  return (
    await Promise.all(userIds.map((userId) => connectUserDB(userId, extra.db)))
  ).filter(Boolean);
});

export const loadUser = createAsyncThunk<
  User,
  { uid: string },
  { extra: ThunkExtra }
>('users/loadOne', async ({ uid }, { extra }) => {
  return connectUserDB(uid, extra.db);
});

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
