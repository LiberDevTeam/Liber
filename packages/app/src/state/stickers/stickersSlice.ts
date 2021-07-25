import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import type {
  LiberMarketInstance,
  LiberStickerInstance,
} from 'contracts/@types-typechain';
import MarketContract from 'contracts/build/contracts/LiberMarket.json';
import StickerContract from 'contracts/build/contracts/LiberSticker.json';
import { getUnixTime } from 'date-fns';
import Web3 from 'web3';
import { history } from '~/history';
import { connectMarketplaceStickerNewKeyValue } from '~/lib/db/marketplace/sticker/new';
import { connectMarketplaceStickerRankingKeyValue } from '~/lib/db/marketplace/sticker/ranking';
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
    web3React: Web3ReactContextInterface<Web3>;
  },
  { dispatch: AppDispatch; state: RootState }
>(
  'stickers/createNewSticker',
  async (
    { category, name, description, contents, price, web3React },
    { dispatch, getState }
  ) => {
    const { me } = getState();
    const { library, chainId, account } = web3React;

    // web3 PublishToken
    if (!(chainId && account && library)) return;
    const marketAddress =
      (MarketContract.networks as any)[String(chainId)] || '';
    const stickerAddress =
      (StickerContract.networks as any)[String(chainId)] || '';
    const marketContract = (new library.eth.Contract(
      MarketContract.abi as any,
      marketAddress
    ) as unknown) as LiberMarketInstance;
    const stickerContract = (new library.eth.Contract(
      StickerContract.abi as any,
      stickerAddress
    ) as unknown) as LiberStickerInstance;
    if (!(marketContract && stickerContract)) return;
    const publishedTokenId = ((
      await stickerContract.methods.publishNewSticker()
    ).logs as {
      event: string;
      args: { tokenId: number };
    }[])
      .filter((log) => log.event === 'PublishToken')
      .reduce((accm, log) => {
        console.log('publish token event log', log);
        if ('tokenId' in log.args) {
          return log.args.tokenId.toString();
        }
        return accm;
      }, '');
    const listedTokenId = ((
      await marketContract.methods.listToken(
        stickerAddress,
        publishedTokenId,
        price,
        true
      )
    ).logs as {
      event: string;
      args: { itemId: number };
    }[])
      .filter((log) => log.event === 'ListItem')
      .reduce((accm, log) => {
        console.log('list token event log', log);
        if ('itemId' in log.args) {
          return log.args.itemId.toString();
        }
        return accm;
      }, '');

    const stickerKeyValue = await createStickerKeyValue(listedTokenId);

    const sticker: Sticker = {
      id: listedTokenId,
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

    const userDB = await createUserDB();
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

    const marketplaceStickerNewDB = await connectMarketplaceStickerNewKeyValue();
    await marketplaceStickerNewDB.put(
      `${sticker.keyValAddress}/${sticker.id}`,
      sticker
    );
    const marketplaceStickerRankingDB = await connectMarketplaceStickerRankingKeyValue();
    await marketplaceStickerRankingDB.put(
      `${sticker.keyValAddress}/${sticker.id}`,
      sticker
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

    const sticker = readStickerFromDB(stickerKeyValue);
    const newSticker = {
      ...sticker,
      ...partial,
    };
    const marketplaceStickerNewDB = await connectMarketplaceStickerNewKeyValue();
    await marketplaceStickerNewDB.put(
      `${sticker.keyValAddress}/${sticker.id}`,
      newSticker
    );
    const marketplaceStickerRankingDB = await connectMarketplaceStickerRankingKeyValue();
    await marketplaceStickerRankingDB.put(
      `${sticker.keyValAddress}/${sticker.id}`,
      newSticker
    );

    dispatch(updateOne({ id: stickerId, changes: partial }));
    history.push(`/stickers/${address}/${stickerId}`);

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
    history.push('/404');
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
export const selectStickerById = (id: string) => (
  state: RootState
): Sticker | undefined => selectors.selectById(state.stickers, id);
export const selectStickersByIds = (ids: string[]) => (
  state: RootState
): Sticker[] =>
  ids
    .map((id) => selectors.selectById(state.stickers, id))
    .filter(Boolean) as Sticker[];

export default stickersSlice.reducer;
