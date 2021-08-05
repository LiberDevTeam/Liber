import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { getUnixTime } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { history } from '~/history';
import { tmpPurchased } from '~/state/bots/mock';
import { AppDispatch, RootState, ThunkExtra } from '~/state/store';
import { BotPK } from '../me/type';
import { addIpfsContent } from '../p2p/ipfsContentsSlice';
import { User } from '../users/type';
import { Bot, BotPartialForUpdate, Example } from './types';

export const categories = [
  'ANALYTICS',
  'COMMUNICATION',
  'DESIGN',
  'DEVELOPER_TOOLS',
  'FILE_MANAGEMENT',
  'HEALTH_WELLNESS',
  'HR_TEAM_CULTURE',
  'MARKETING',
  'OFFICE_MANAGEMENT',
  'FINANCE',
  'PRODUCTIVITY',
  'PROJECT_MANAGEMENT',
  'SALES',
  'SECURITY_COMPLIANCE',
  'SOCIAL_FUN',
  'TRAVEL',
  'VOICE_VIDEO',
  'MEDIA_NEWS',
];
export const categoryOptions = categories.map((label, index) => ({
  value: `${index}`,
  label,
}));

export const fetchBot = createAsyncThunk<
  void,
  {
    botId: string;
    address: string;
  },
  { dispatch: AppDispatch; state: RootState; extra: ThunkExtra }
>('bots/fetchBot', async ({ botId, address }, { dispatch, extra }) => {
  const db = await extra.db.bot.connect({ botId, address });
  const bot = extra.db.bot.read(db);
  if (!bot) {
    history.push('/404');
    return;
  }

  dispatch(addBot(bot));
});

export const createNewBot = createAsyncThunk<
  BotPK,
  {
    category: number;
    name: string;
    description: string;
    avatar: File;
    price: number;
    readme: string;
    sourceCode: string;
    examples: Example[];
  },
  { dispatch: AppDispatch; state: RootState; extra: ThunkExtra }
>(
  'bots/createNewBot',
  async (
    {
      category,
      name,
      description,
      avatar,
      price,
      readme,
      sourceCode,
      examples,
    },
    { dispatch, getState, extra }
  ) => {
    const { me } = getState();

    const id = uuidv4();
    const botKeyValue = await extra.db.bot.create(id);

    const bot: Bot = {
      id,
      uid: me.id,
      category,
      name,
      description,
      avatar: await addIpfsContent(avatar),
      price,
      readme,
      sourceCode,
      examples,
      keyValAddress: botKeyValue.address.root,
      created: getUnixTime(Date.now()),
      qtySold: 0,
    };

    Object.keys(bot).forEach((key) => {
      const v = bot[key as keyof Bot];
      v && botKeyValue.put(key, v);
    });

    const userDB = await extra.db.user.create();
    const user = userDB.get('data');
    if (!user) {
      throw new Error('user is not found');
    }

    const botPK = {
      botId: id,
      address: botKeyValue.address.root,
    };
    const newUser: User = {
      ...user,
      botsListingOn: [...user.botsListingOn, botPK],
    };
    userDB.set('data', newUser);

    const marketplaceNewBotDB = await extra.db.marketplaceBotNew.connect();
    const keystore1 = marketplaceNewBotDB.identity.provider.keystore;
    await marketplaceNewBotDB.put(
      `/${marketplaceNewBotDB.identity.publicKey}/${bot.keyValAddress}/${bot.id}`,
      {
        signature: await keystore1.sign(
          await keystore1.getKey(marketplaceNewBotDB.identity.id),
          JSON.stringify(bot)
        ),
        ...bot,
      }
    );

    const marketplaceBotRankingDB =
      await extra.db.marketplaceBotRanking.connect();
    const keystore2 = marketplaceNewBotDB.identity.provider.keystore;
    await marketplaceBotRankingDB.put(
      `/${marketplaceBotRankingDB.identity.publicKey}/${bot.keyValAddress}/${bot.id}`,
      {
        signature: await keystore2.sign(
          await keystore2.getKey(marketplaceBotRankingDB.identity.id),
          JSON.stringify(bot)
        ),
        ...bot,
      }
    );

    dispatch(addBot(bot));
    history.push(`/bots/${bot.keyValAddress}/${bot.id}`);

    // TODO: show notification

    return botPK;
  }
);

export const updateBot = createAsyncThunk<
  void,
  {
    botId: string;
    address: string;
    category: number;
    name: string;
    description: string;
    avatar: File;
    price: number;
    readme: string;
    sourceCode: string;
    examples: Example[];
  },
  { dispatch: AppDispatch; state: RootState; extra: ThunkExtra }
>(
  'bots/updateBot',
  async (
    {
      botId,
      address,
      category,
      name,
      description,
      avatar,
      price,
      readme,
      sourceCode,
      examples,
    },
    { dispatch, extra }
  ) => {
    const botKeyValue = await extra.db.bot.connect({
      botId,
      address,
    });

    const partial: BotPartialForUpdate = {
      category,
      name,
      description,
      avatar: await addIpfsContent(avatar),
      price,
      readme,
      sourceCode,
      examples,
    };

    Object.keys(partial).forEach((key) => {
      const v = partial[key as keyof BotPartialForUpdate];
      v && botKeyValue.put(key, v);
    });

    const bot = extra.db.bot.read(botKeyValue);
    const newBot = {
      ...bot,
      ...partial,
    };
    const marketplaceNewBotDB = await extra.db.marketplaceBotNew.connect();
    const keystore1 = marketplaceNewBotDB.identity.provider.keystore;
    await marketplaceNewBotDB.put(
      `/${marketplaceNewBotDB.identity.publicKey}/${bot.keyValAddress}/${bot.id}`,
      {
        signature: await keystore1.sign(
          await keystore1.getKey(marketplaceNewBotDB.identity.id),
          JSON.stringify(newBot)
        ),
        ...newBot,
      }
    );

    const marketplaceBotRankingDB =
      await extra.db.marketplaceBotRanking.connect();
    const keystore2 = marketplaceNewBotDB.identity.provider.keystore;
    await marketplaceBotRankingDB.put(
      `/${marketplaceBotRankingDB.identity.publicKey}/${bot.keyValAddress}/${bot.id}`,
      {
        signature: await keystore2.sign(
          await keystore2.getKey(marketplaceBotRankingDB.identity.id),
          JSON.stringify(newBot)
        ),
        ...newBot,
      }
    );

    dispatch(updateOne({ id: botId, changes: partial }));
    history.push(`/bots/${address}/${botId}`);

    // TODO: show notification
  }
);

const botsAdapter = createEntityAdapter<Bot>();

export const botsSlice = createSlice({
  name: 'bots',
  // initialState: botsAdapter.getInitialState(),
  initialState: botsAdapter.addMany({ ids: [], entities: {} }, tmpPurchased),
  // initialState: botsAdapter.getInitialState(),
  reducers: {
    addBots: (state, action: PayloadAction<Bot[]>) =>
      botsAdapter.addMany(state, action.payload),
    addBot: (state, action: PayloadAction<Bot>) =>
      botsAdapter.addOne(state, action.payload),
    updateOne: (
      state,
      action: PayloadAction<{ id: string; changes: BotPartialForUpdate }>
    ) =>
      botsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload.changes,
      }),
  },
});

export const { updateOne, addBots, addBot } = botsSlice.actions;

const selectors = botsAdapter.getSelectors();
export const selectBotById =
  (id: string | null | undefined) => (state: RootState) => {
    if (id) {
      return selectors.selectById(state.bots, id);
    }
    return undefined;
  };
export const selectBotsByIds =
  (ids: string[]) =>
  (state: RootState): Bot[] =>
    ids
      .map((id) => selectors.selectById(state.bots, id))
      .filter(Boolean) as Bot[];

export default botsSlice.reducer;
