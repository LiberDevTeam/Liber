import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  connectPrivateFieldsDB,
  createPrivateFieldsDB,
} from '~/lib/db/privateFields';
import { connectUserDB, createUserDB } from '~/lib/db/user';
import { addIpfsContent } from '~/state/p2p/ipfsContentsSlice';
import { AppDispatch, RootState } from '~/state/store';
import { User } from '~/state/users/type';
import { Me, PlacePK } from './type';

const initialPrivateFields = {
  settings: {
    isIsolation: false,
  },
  joinedPlaces: [],
  purchasedBots: [],
  purchasedStickers: [],
};

const initialState: Me = {
  id: '',
  botsListingOn: [],
  stickersListingOn: [],
  privateDBAddress: '',
  ...initialPrivateFields,
};

export const DB_KEY = 'data';

export const initMe = createAsyncThunk<Me, void, { state: RootState }>(
  'me/init',
  async () => {
    const userDB = await createUserDB();

    let user: User = userDB.get(DB_KEY);
    if (!user) {
      user = {
        id: userDB.address.root,
        username: '',
        avatarCid: '',
        botsListingOn: [],
        stickersListingOn: [],
      };
      await userDB.set(DB_KEY, user);
    }

    const privateDB = await createPrivateFieldsDB();
    let privateFields = privateDB.get(DB_KEY);
    if (!privateFields) {
      privateFields = initialPrivateFields;
      await privateDB.set(DB_KEY, initialPrivateFields);
    }

    return {
      ...user,
      ...privateFields,
      id: userDB.address.root,
      privateDBAddress: privateDB.address.root,
    };
  }
);

export const updateProfile = createAsyncThunk<
  Me,
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

export const updateProperties = createAsyncThunk<
  Me,
  {
    listBot?: string;
    purchaseBot?: string;
    listSticker?: string;
    purchaseSticker?: string;
  },
  { dispatch: AppDispatch; state: RootState }
>(
  'me/updateProperties',
  async (
    { listBot, purchaseBot, listSticker, purchaseSticker },
    { getState }
  ) => {
    const me = getState().me;

    let newMe = { ...me };

    if (listBot) {
      const userDB = await connectUserDB({ userId: me.id });
      const user = userDB.get(DB_KEY);
      user.botsListingOn.push(listBot);
      await userDB.set(DB_KEY, user);
      newMe = { ...newMe, ...user };
    }

    if (purchaseBot) {
      const privateDB = await connectPrivateFieldsDB({
        address: me.privateDBAddress,
      });
      const priv = privateDB.get(DB_KEY);
      priv.purchasedBots.push(purchaseBot);
      await privateDB.set(DB_KEY, priv);
      newMe = { ...newMe, ...priv };
    }

    if (listSticker) {
      const userDB = await connectUserDB({ userId: me.id });
      const user = userDB.get(DB_KEY);
      user.stickersListingOn.push(listSticker);
      await userDB.set(DB_KEY, user);
      newMe = { ...newMe, ...user };
    }

    if (purchaseSticker) {
      const privateDB = await connectPrivateFieldsDB({
        address: me.privateDBAddress,
      });
      const priv = privateDB.get(DB_KEY);
      priv.purchasedStickers.push(purchaseSticker);
      await privateDB.set(DB_KEY, priv);
      newMe = { ...newMe, ...priv };
    }

    return newMe;
  }
);

export const appendJoinedPlace = createAsyncThunk<
  PlacePK,
  PlacePK,
  { dispatch: AppDispatch; state: RootState }
>('me/appendJoinedPlace', async (pk, { getState }) => {
  const privateDB = await connectPrivateFieldsDB({
    address: getState().me.privateDBAddress,
  });
  const priv = privateDB.get(DB_KEY);
  priv.joinedPlaces = [...priv.joinedPlaces, pk];
  await privateDB.set(DB_KEY, priv);
  return pk;
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
      .addCase(initMe.fulfilled, (state, action) => action.payload)
      .addCase(updateProfile.fulfilled, (state, action) => action.payload)
      .addCase(updateProperties.fulfilled, (state, action) => action.payload)
      .addCase(appendJoinedPlace.fulfilled, (state, action) => {
        state.joinedPlaces.push(action.payload);
      });
  },
});

export const { updateIsolationMode } = meSlice.actions;

export const selectMe = (state: RootState): typeof state.me => state.me;

export default meSlice.reducer;
