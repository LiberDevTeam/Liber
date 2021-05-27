import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import { getUnixTime } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import {
  connectStickerKeyValue,
  createStickerKeyValue,
  readStickerFromDB,
} from '~/lib/db/sticker';
import { AppDispatch, RootState } from '~/state/store';
import { addIpfsContent } from '../p2p/ipfsContentsSlice';

export enum Category {
  AnimalLovers = 'AnimalLovers',
}

interface PartialForUpdate {
  category: Category;
  name: string;
  description: string;
  price: number;
  contents: Content[];
}

export interface Sticker extends PartialForUpdate {
  id: string;
  uid: string;
  keyValAddress: string;
  created: number;
  purchased?: boolean; // means the current user purchased the sticker.
}

export interface Content {
  cid: string;
}

export interface StickersState {
  purchased: Sticker[];
  listingOn: Sticker[];
}

export const tmpListingOn: Sticker[] = [...Array(10)].map((_, i) => ({
  // id: `9C095752-A668-4BCB-A61C-7083585BDCD2${i}`,
  id: 'f3a4e42d-d378-401e-9561-aaa0df48bbf8',
  // uid: `94801C77-68E9-4193-B253-C91983477A0D${i}`,
  uid: `zdpuAyXpBz4JabtxnkRGT2jUjvtnpwf4jp1pkq676pGfgyEk7`,
  category: Category.AnimalLovers,
  name: 'バク',
  description: 'モデルやってます。性別はありません',
  price: 20,
  keyValAddress: 'zdpuAreQgca8hSsMvfYT4U9QwWJhxHqKSuGwcfu7g3kStUpcp',
  contents: [
    { cid: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh' },
    { cid: 'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT' },
    { cid: 'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV' },
    { cid: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh' },
    { cid: 'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT' },
    { cid: 'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV' },
    { cid: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh' },
    { cid: 'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT' },
    { cid: 'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV' },
    { cid: 'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV' },
  ],
  created: 1619251130,
}));

export const tmpPurchased: Sticker[] = [...Array(10)].map((_, i) => ({
  // id: `9C095752-A668-4BCB-A61C-7083585BDCD2${i}`,
  id: 'f3a4e42d-d378-401e-9561-aaa0df48bbf8',
  // uid: `94801C77-68E9-4193-B253-C91983477A0D${i}`,
  uid: `zdpuAyXpBz4JabtxnkRGT2jUjvtnpwf4jp1pkq676pGfgyEk7`,
  category: Category.AnimalLovers,
  name: 'バク',
  description: 'モデルやってます。性別はありません',
  price: 20,
  keyValAddress: 'zdpuAreQgca8hSsMvfYT4U9QwWJhxHqKSuGwcfu7g3kStUpcp',
  contents: [
    { cid: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh' },
    { cid: 'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT' },
    { cid: 'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV' },
    { cid: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh' },
    { cid: 'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT' },
    { cid: 'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV' },
    { cid: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh' },
    { cid: 'QmR76zq8z4ycVQHpJH6YoynkUah2ZfDkodAKJ7PPsGNDmT' },
    { cid: 'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV' },
    { cid: 'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV' },
  ],
  created: 1619251130,
  purchased: true,
}));

export const createNewSticker = createAsyncThunk<
  void,
  {
    category: Category;
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

    // TODO: create index to Liber search.

    dispatch(addSticker(sticker));
    dispatch(push(`/stickers/${sticker.id}`));

    // TODO: show notification
  }
);

export const updateSticker = createAsyncThunk<
  void,
  {
    stickerId: string;
    address: string;
    category: Category;
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

    const partial: PartialForUpdate = {
      category,
      name,
      description,
      price,
      contents: newContents,
    };

    Object.keys(partial).forEach((key) => {
      const v = partial[key as keyof PartialForUpdate];
      v && stickerKeyValue.put(key, v);
    });

    // TODO: update index to Liber search.

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
      action: PayloadAction<{ id: string; changes: PartialForUpdate }>
    ) =>
      stickersAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload.changes,
      }),
  },
});

export const { addStickers, addSticker, updateOne } = stickersSlice.actions;

const selectors = stickersAdapter.getSelectors();
export const selectStickerById = (id: string) => (state: RootState) =>
  selectors.selectById(state.stickers, id);
export const selectStickersByIds = (ids: string[]) => (state: RootState) =>
  ids.map((id) => selectors.selectById(state.stickers, id));

export default stickersSlice.reducer;
