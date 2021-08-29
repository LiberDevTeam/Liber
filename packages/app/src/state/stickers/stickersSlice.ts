import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { getUnixTime } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { history } from '~/history';
import { AppDispatch, RootState, ThunkExtra } from '~/state/store';
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
  { dispatch: AppDispatch; state: RootState; extra: ThunkExtra }
>(
  'stickers/createNewSticker',
  async (
    { category, name, description, contents, price },
    { dispatch, getState, extra }
  ) => {
    const { me } = getState();

    const id = uuidv4();

    const stickerKeyValue = await extra.db.sticker.create(id);

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
          cid: await addIpfsContent(content),
        }))
      ),
      created: getUnixTime(Date.now()),
      qtySold: 0,
    };

    Object.keys(sticker).forEach((key) => {
      const v = sticker[key as keyof Sticker];
      v && stickerKeyValue.put(key, v);
    });

    const userDB = await extra.db.user.create();
    const user = userDB.get(DB_KEY);
    if (!user) {
      throw new Error('user is not found');
    }

    const stickerPK = {
      stickerId: listedTokenId,
      address: stickerKeyValue.address.root,
    };
    const newUser: User = {
      ...user,
      stickersListingOn: [...user.stickersListingOn, stickerPK],
    };
    userDB.set(DB_KEY, newUser);

    const marketplaceStickerNewDB =
      await extra.db.marketplaceStickerNew.connect();
    const keystore1 = marketplaceStickerNewDB.identity.provider.keystore;
    await marketplaceStickerNewDB.put(
      `/${marketplaceStickerNewDB.identity.publicKey}/${sticker.keyValAddress}/${sticker.id}`,
      {
        signature: await keystore1.sign(
          await keystore1.getKey(marketplaceStickerNewDB.identity.id),
          JSON.stringify(sticker)
        ),
        ...sticker,
      }
    );

    const marketplaceStickerRankingDB =
      await extra.db.marketplaceStickerRanking.connect();
    const keystore2 = marketplaceStickerRankingDB.identity.provider.keystore;
    await marketplaceStickerRankingDB.put(
      `/${marketplaceStickerRankingDB.identity.publicKey}/${sticker.keyValAddress}/${sticker.id}`,
      {
        signature: await keystore2.sign(
          await keystore2.getKey(marketplaceStickerRankingDB.identity.id),
          JSON.stringify(sticker)
        ),
        ...sticker,
      }
    );

    dispatch(addSticker(sticker));
    history.push(`/stickers/${stickerKeyValue.address.root}/${sticker.id}`);

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
  { dispatch: AppDispatch; state: RootState; extra: ThunkExtra }
>(
  'stickers/updateSticker',
  async (
    { stickerId, address, category, name, description, price, contents },
    { dispatch, extra }
  ) => {
    const stickerKeyValue = await extra.db.sticker.connect({
      stickerId,
      address,
    });

    const newContents = await Promise.all(
      contents.map(async (content) => {
        const cid = await addIpfsContent(content);
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

    const sticker = extra.db.sticker.read(stickerKeyValue);
    const newSticker = {
      ...sticker,
      ...partial,
    };

    const marketplaceStickerNewDB =
      await extra.db.marketplaceStickerNew.connect();
    const keystore1 = marketplaceStickerNewDB.identity.provider.keystore;
    await marketplaceStickerNewDB.put(
      `/${marketplaceStickerNewDB.identity.publicKey}/${sticker.keyValAddress}/${sticker.id}`,
      {
        signature: await keystore1.sign(
          await keystore1.getKey(marketplaceStickerNewDB.identity.id),
          JSON.stringify(newSticker)
        ),
        ...newSticker,
      }
    );

    const marketplaceStickerRankingDB =
      await extra.db.marketplaceStickerRanking.connect();
    const keystore2 = marketplaceStickerRankingDB.identity.provider.keystore;
    await marketplaceStickerRankingDB.put(
      `/${marketplaceStickerRankingDB.identity.publicKey}/${sticker.keyValAddress}/${sticker.id}`,
      {
        signature: await keystore2.sign(
          await keystore2.getKey(marketplaceStickerRankingDB.identity.id),
          JSON.stringify(newSticker)
        ),
        ...newSticker,
      }
    );

    dispatch(updateOne({ id: stickerId, changes: partial }));
    history.push(`/stickers/${address}/${stickerId}`);

    // TODO: show notification
  }
);

export const fetchSticker = createAsyncThunk<
  void,
  { stickerId: string; address: string },
  { dispatch: AppDispatch; state: RootState; extra: ThunkExtra }
>(
  'stickers/fetchSticker',
  async ({ stickerId, address }, { dispatch, extra }) => {
    const db = await extra.db.sticker.connect({ stickerId, address });
    const sticker = extra.db.sticker.read(db);
    if (!sticker) {
      history.push('/404');
      return;
    }

    dispatch(addSticker(sticker));
  }
);

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
