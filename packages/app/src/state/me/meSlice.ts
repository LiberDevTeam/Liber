import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { generate } from 'canihazusername';
import { connectBotKeyValue, readBotFromDB } from '~/lib/db/bot';
import {
  connectPrivateFieldsDB,
  createPrivateFieldsDB,
} from '~/lib/db/privateFields';
import { connectStickerKeyValue, readStickerFromDB } from '~/lib/db/sticker';
import { connectUserDB, createUserDB } from '~/lib/db/user';
import { addIpfsContent } from '~/state/p2p/ipfsContentsSlice';
import { AppDispatch, RootState } from '~/state/store';
import { User } from '~/state/users/type';
import { botAdded } from '../actionCreater';
import { addBots } from '../bots/botsSlice';
import { stickerAdded } from '../stickers/actions';
import { addStickers } from '../stickers/stickersSlice';
import { Me, PlacePK, PrivateFields, StickerPK } from './type';

const initialPrivateFields: PrivateFields = {
  settings: {
    isIsolation: false,
  },
  joinedPlaces: [],
  purchasedBots: [],
  purchasedStickers: [],
};

const initialState: Me = {
  id: '',
  name: '',
  botsListingOn: [],
  stickersListingOn: [],
  privateDBAddress: '',
  ...initialPrivateFields,
};

export const DB_KEY = 'data';

export const initMe = createAsyncThunk<
  Me,
  void,
  { dispatch: AppDispatch; state: RootState }
>('me/init', async (_0, { dispatch }) => {
  const userDB = await createUserDB();

  let user: User = userDB.get(DB_KEY);
  if (!user) {
    user = {
      id: userDB.address.root,
      name: generate('{character}-{english}'),
      avatarCid: '',
      botsListingOn: [],
      stickersListingOn: [],
    };
    await userDB.set(DB_KEY, user);
  }

  const stickers = await Promise.all(
    user.stickersListingOn.map(async ({ stickerId, address }) => {
      const stickerDB = await connectStickerKeyValue({ stickerId, address });
      return readStickerFromDB(stickerDB);
    })
  );

  dispatch(addStickers(stickers));

  const bots = await Promise.all(
    user.botsListingOn.map(async ({ botId, address }) => {
      const botDB = await connectBotKeyValue({ botId, address });
      return readBotFromDB(botDB);
    })
  );

  dispatch(addBots(bots));

  const privateDB = await createPrivateFieldsDB();
  let privateFields = privateDB.get(DB_KEY);
  if (!privateFields) {
    privateFields = initialPrivateFields;
    await privateDB.set(DB_KEY, initialPrivateFields);
  }

  // TODO: debug code
  privateFields.purchasedStickers = [
    {
      address: 'zdpuArpuuaVo7ZWpwoyxadzDDAQiXwXhZTsfbi9ppx5H8GRW8',
      stickerId: '34aa7760-5929-4530-8548-facc4657bdef',
    },
  ];

  return {
    ...user,
    ...privateFields,
    id: userDB.address.root,
    privateDBAddress: privateDB.address.root,
  };
});

export const updateProfile = createAsyncThunk<
  Me,
  { avatar: File | null; name: string },
  { dispatch: AppDispatch; state: RootState }
>('me/updateProfile', async ({ avatar, name }, { getState }) => {
  const me = getState().me;
  const userDB = await connectUserDB({ userId: me.id });

  let avatarCid = me.avatarCid;

  if (avatar) {
    avatarCid = await addIpfsContent(avatar);
  }

  const newProfile: Me = { ...me, name, avatarCid };
  userDB.set(DB_KEY, newProfile);
  return newProfile;
});

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
      // .addCase(updateProperties.fulfilled, (state, action) => action.payload)
      .addCase(appendJoinedPlace.fulfilled, (state, action) => {
        state.joinedPlaces.push(action.payload);
      })
      .addCase(stickerAdded, (state, action) => {
        state.stickersListingOn.push(action.payload);
      })
      .addCase(botAdded, (state, action) => {
        state.botsListingOn.push(action.payload);
      });
  },
});

export const { updateIsolationMode } = meSlice.actions;

export const selectMe = (state: RootState): typeof state.me => state.me;
export const selectPurchasedBots = (state: RootState) => state.me.purchasedBots;
// export const selectPurchasedBot = (pk: BotPK) => (state: RootState) => state.me.;
export const selectPurchasedStickers = (state: RootState): StickerPK[] =>
  state.me.purchasedStickers;
// export const selectPurchasedSticker = (pk: StickerPK) => (state: RootState) => state.me.purchasedStickers.find(({stickerId, address}) => stickerId === pk.stickerId && address === pk.address);
export const selectBotsListingOn = (state: RootState) => state.me.botsListingOn;
export const selectStickersListingOn = (state: RootState) =>
  state.me.stickersListingOn;

export default meSlice.reducer;