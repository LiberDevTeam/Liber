import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import { getUnixTime } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { connectMarketplaceStickerKeyValue } from '~/lib/db/marketplace/sticker';
import {
  connectStickerKeyValue,
  createStickerKeyValue,
  readStickerFromDB,
} from '~/lib/db/sticker';
import { createUserDB } from '~/lib/db/user';
import { AppDispatch, RootState } from '~/state/store';
import { DB_KEY } from '../me/meSlice';
import { addIpfsContent } from '../p2p/ipfsContentsSlice';
import { User } from '../users/type';
import { stickerAdded } from './actions';
import { Sticker, StickerPartialForUpdate } from './types';

export const categories = ['ANIMAL_LOVERS'];
export const categoryOptions = categories.map((label, index) => ({
  value: `${index}`,
  label,
}));

export interface StickersState {
  purchased: Sticker[];
  listingOn: Sticker[];
}

export const createNewSticker = createAsyncThunk<
  void,
  {
    category: number;
    name: string;
    price: number;
    description: string;
    contents: File[];
  },
  { dispatch: AppDispatch; state: RootState }
>(
  'stickers/createNewSticker',
  async (
    { category, name, description, contents, price },
    { dispatch, getState }
  ) => {
    const { me } = getState();

    const id = uuidv4();
    const stickerKeyValue = await createStickerKeyValue(id);

    const sticker: Sticker = {
      id,
      category,
      uid: me.id,
      name,
      description,
      price,
      keyValAddress: stickerKeyValue.address.root,
      contents: await Promise.all(
        contents.map(async (content) => ({
          cid: await addIpfsContent(dispatch, content),
        }))
      ),
      created: getUnixTime(Date.now()),
    };

    Object.keys(sticker).forEach((key) => {
      const v = sticker[key as keyof Sticker];
      v && stickerKeyValue.put(key, v);
    });

    const userDB = await createUserDB();
    const user = userDB.get(DB_KEY);
    if (!user) {
      throw new Error('user is not found');
    }

    const stickerPK = {
      stickerId: id,
      address: stickerKeyValue.address.root,
    };
    const newUser: User = {
      ...user,
      stickersListingOn: [...user.stickersListingOn, stickerPK],
    };
    userDB.set(DB_KEY, newUser);

    const marketplaceStickerDB = await connectMarketplaceStickerKeyValue();
    await marketplaceStickerDB.put(
      `${sticker.keyValAddress}/${sticker.id}`,
      sticker
    );

    dispatch(addSticker(sticker));
    dispatch(push(`/stickers/${stickerKeyValue.address.root}/${sticker.id}`));

    // TODO: show notification

    dispatch(stickerAdded(stickerPK));
  }
);

export const updateSticker = createAsyncThunk<
  void,
  {
    stickerId: string;
    address: string;
    category: number;
    name: string;
    description: string;
    price: number;
    contents: File[];
  },
  { dispatch: AppDispatch; state: RootState }
>(
  'stickers/updateSticker',
  async (
    { stickerId, address, category, name, description, price, contents },
    { dispatch }
  ) => {
    const stickerKeyValue = await connectStickerKeyValue({
      stickerId,
      address,
    });

    const newContents = await Promise.all(
      contents.map(async (content) => {
        const cid = await addIpfsContent(dispatch, content);
        return { cid };
      })
    );

    const partial: StickerPartialForUpdate = {
      category,
      name,
      description,
      price,
      contents: newContents,
    };

    Object.keys(partial).forEach((key) => {
      const v = partial[key as keyof StickerPartialForUpdate];
      v && stickerKeyValue.put(key, v);
    });

    const sticker = readStickerFromDB(stickerKeyValue);
    const marketplaceStickerDB = await connectMarketplaceStickerKeyValue();
    await marketplaceStickerDB.put(`${sticker.keyValAddress}/${sticker.id}`, {
      ...sticker,
      ...partial,
    });

    dispatch(updateOne({ id: stickerId, changes: partial }));
    dispatch(push(`/stickers/${address}/${stickerId}`));

    // TODO: show notification
  }
);

export const fetchSticker = createAsyncThunk<
  void,
  { stickerId: string; address: string },
  { dispatch: AppDispatch; state: RootState }
>('stickers/fetchSticker', async ({ stickerId, address }, { dispatch }) => {
  const db = await connectStickerKeyValue({ stickerId, address });
  const sticker = readStickerFromDB(db);
  if (!sticker) {
    dispatch(push('/404'));
    return;
  }

  dispatch(addSticker(sticker));
});

const stickersAdapter = createEntityAdapter<Sticker>();

stickersAdapter.getInitialState();

export const stickersSlice = createSlice({
  name: 'stickers',
  initialState: stickersAdapter.getInitialState(),
  reducers: {
    addStickers: (state, action: PayloadAction<Sticker[]>) =>
      stickersAdapter.addMany(state, action.payload),
    addSticker: (state, action: PayloadAction<Sticker>) =>
      stickersAdapter.addOne(state, action.payload),
    updateOne: (
      state,
      action: PayloadAction<{ id: string; changes: StickerPartialForUpdate }>
    ) =>
      stickersAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload.changes,
      }),
  },
});

export const { addStickers, addSticker, updateOne } = stickersSlice.actions;

const selectors = stickersAdapter.getSelectors();
export const selectStickerById =
  (id: string) =>
  (state: RootState): Sticker | undefined =>
    selectors.selectById(state.stickers, id);
export const selectStickersByIds =
  (ids: string[]) =>
  (state: RootState): Sticker[] =>
    ids
      .map((id) => selectors.selectById(state.stickers, id))
      .filter(Boolean) as Sticker[];

export default stickersSlice.reducer;
