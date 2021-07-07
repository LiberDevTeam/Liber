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
  connectBotKeyValue,
  createBotKeyValue,
  readBotFromDB,
} from '~/lib/db/bot';
import { connectMarketplaceBotNewKeyValue } from '~/lib/db/marketplace/bot/new';
import { createUserDB } from '~/lib/db/user';
import { tmpPurchased } from '~/state/bots/mock';
import { AppDispatch, RootState } from '~/state/store';
import { BotPK } from '../me/type';
import { addIpfsContent } from '../p2p/ipfsContentsSlice';
import { User } from '../users/type';

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

interface PartialForUpdate {
  category: number;
  name: string;
  description: string;
  avatar: string;
  price: number;
  readme: string;
  sourceCode: string;
  examples: Example[];
}

export interface Example {
  title: string;
  input: string;
  output: string;
}

export interface Bot extends PartialForUpdate {
  id: string;
  uid: string;
  keyValAddress: string;
  created: number;
  purchaseQty: number;
}

export const fetchBot = createAsyncThunk<
  void,
  {
    botId: string;
    address: string;
  },
  { dispatch: AppDispatch; state: RootState }
>('bots/fetchBot', async ({ botId, address }, { dispatch }) => {
  const db = await connectBotKeyValue({ botId, address });
  const bot = readBotFromDB(db);
  if (!bot) {
    dispatch(push('/404'));
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
  { dispatch: AppDispatch; state: RootState }
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
    { dispatch, getState }
  ) => {
    const { me } = getState();

    const id = uuidv4();
    const botKeyValue = await createBotKeyValue(id);

    const bot: Bot = {
      id,
      uid: me.id,
      category,
      name,
      description,
      avatar: await addIpfsContent(dispatch, avatar),
      price,
      readme,
      sourceCode,
      examples,
      keyValAddress: botKeyValue.address.root,
      created: getUnixTime(Date.now()),
      purchaseQty: 0,
    };

    Object.keys(bot).forEach((key) => {
      const v = bot[key as keyof Bot];
      v && botKeyValue.put(key, v);
    });

    const userDB = await createUserDB();
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

    const marketplaceBotDB = await connectMarketplaceBotNewKeyValue();
    await marketplaceBotDB.put(`${bot.keyValAddress}/${bot.id}`, bot);

    dispatch(addBot(bot));
    dispatch(push(`/bots/${bot.keyValAddress}/${bot.id}`));

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
  { dispatch: AppDispatch; state: RootState }
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
    { dispatch }
  ) => {
    const botKeyValue = await connectBotKeyValue({
      botId,
      address,
    });

    const partial: PartialForUpdate = {
      category,
      name,
      description,
      avatar: await addIpfsContent(dispatch, avatar),
      price,
      readme,
      sourceCode,
      examples,
    };

    Object.keys(partial).forEach((key) => {
      const v = partial[key as keyof PartialForUpdate];
      v && botKeyValue.put(key, v);
    });

    const bot = readBotFromDB(botKeyValue);
    const marketplaceBotDB = await connectMarketplaceBotNewKeyValue();
    await marketplaceBotDB.put(`${bot.keyValAddress}/${bot.id}`, {
      ...bot,
      ...partial,
    });

    dispatch(updateOne({ id: botId, changes: partial }));
    dispatch(push(`/bots/${address}/${botId}`));

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
      action: PayloadAction<{ id: string; changes: PartialForUpdate }>
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
