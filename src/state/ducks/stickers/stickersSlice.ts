import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import { AppDispatch, RootState } from '~/state/store';

export enum Category {
  AnimalLovers = 'Animal Lovers',
}

export interface Sticker {
  id: string;
  uid: string;
  category: Category;
  name: string;
  description: string;
  avatar: string;
  price: number;
  contents: Content[];
  created: number;
  purchased?: number;
}

interface Content {
  cid: string;
}

export interface StickersState {
  purchased: Sticker[];
  listingOn: Sticker[];
}

export const tmpListingOn: Sticker[] = [...Array(10)].map((_, i) => ({
  id: `9C095752-A668-4BCB-A61C-7083585BDCD2${i}`,
  uid: `94801C77-68E9-4193-B253-C91983477A0D${i}`,
  category: Category.AnimalLovers,
  name: 'バク',
  description: 'モデルやってます。性別はありません',
  avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
  price: 20,
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
  id: `9C095752-A668-4BCB-A61C-7083585BDCD2${i}`,
  uid: `94801C77-68E9-4193-B253-C91983477A0D${i}`,
  category: Category.AnimalLovers,
  name: 'バク',
  description: 'モデルやってます。性別はありません',
  avatar: 'QmQxjufmnAxWh57aNGBeLFNWymjijv3D2C3EPQks1BuzVh',
  price: 20,
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

export const fetchSticker = createAsyncThunk<
  void,
  { id: string },
  { dispatch: AppDispatch; state: RootState }
>('bots/fetchBot', async ({ id }, { dispatch }) => {
  // TODO fetch bot from DB
  const sticker = tmpPurchased[0];
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
  },
});

export const { addStickers, addSticker } = stickersSlice.actions;

const selectors = stickersAdapter.getSelectors();
export const selectStickerById = (id: string) => (state: RootState) =>
  selectors.selectById(state.stickers, id);
export const selectStickersByIds = (ids: string[]) => (state: RootState) =>
  ids.map((id) => selectors.selectById(state.stickers, id));

export default stickersSlice.reducer;
