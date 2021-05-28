import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import { getUnixTime } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { createBotKeyValue } from '~/lib/db/bot';
import { AppDispatch, RootState } from '~/state/store';
import { addIpfsContent } from '../p2p/ipfsContentsSlice';

export const categories = [
  'ANALYTICS',
  'COMMUNICATION',
  'CUSTOMER_SUPPORT',
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

export const tmpPurchased: Bot[] = [...Array(10)].map((_, i) => ({
  id: `9C095752-A668-4BCB-A61C-7083585BDCD${i}`,
  uid: `94801C77-68E9-4193-B253-C91983477A0${i}`,
  name: 'Greeting Bot',
  description:
    'Records the attendance times and calculates the monthly wages of employees',
  readme: `
# Greeting Bot

## Usage

## Links
- github.com/LiberDevTeam/Liber
`,
  avatar: 'QmYxKHa7mrEo46YK86HYbSxcjPLbLwDT6aXuL5XzKA3hEJ',
  price: 20,
  sourceCode: `
if (<input> === ping) {
  return 'pong';
} else if (<input> === hello) {
  return 'hi <username>';
}
`,
  created: 1619251130,
  category: 0,
  examples: [
    {
      title: 'pingpong',
      input: 'ping',
      output: 'pong',
    },
    {
      title: 'hello',
      input: 'hello',
      output: 'hi <username>',
    },
  ],
}));

export const tmpListingOn: Bot[] = [...Array(10)].map((_, i) => ({
  id: `9C095752-A668-4BCB-A61C-7083585BDCD${i}`,
  uid: `94801C77-68E9-4193-B253-C91983477A0${i}`,
  name: 'Greeting Bot',
  description:
    'Records the attendance times and calculates the monthly wages of employees',
  readme: `
# Greeting Bot

## Usage

## Links
- github.com/LiberDevTeam/Liber
`,
  avatar: 'QmYxKHa7mrEo46YK86HYbSxcjPLbLwDT6aXuL5XzKA3hEJ',
  price: 20,
  sourceCode: `
if (<input> === ping) {
  return 'pong';
} else if (<input> === hello) {
  return 'hi <username>';
}
`,
  created: 1619251130,
  category: 2,
  examples: [
    {
      title: 'pingpong',
      input: 'ping',
      output: 'pong',
    },
    {
      title: 'hello',
      input: 'hello',
      output: 'hi <username>',
    },
  ],
}));

export interface Example {
  title: string;
  input: string;
  output: string;
}

export interface Bot {
  id: string;
  uid: string;
  name: string;
  category: number;
  description: string;
  avatar: string;
  price: number;
  readme: string;
  sourceCode: string;
  examples: Example[];
  keyValAddress?: string;
  created: number;
  purchased?: number;
}

export const fetchBot = createAsyncThunk<
  void,
  { id: string },
  { dispatch: AppDispatch; state: RootState }
>('bots/fetchBot', async ({ id }, { dispatch }) => {
  // TODO fetch bot from DB
  const bot = tmpPurchased[0];
  if (!bot) {
    dispatch(push('/404'));
    return;
  }

  dispatch(addBot(bot));
});

export const createNewBot = createAsyncThunk<
  void,
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
  'stickers/createNewBot',
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
    };

    Object.keys(bot).forEach((key) => {
      const v = bot[key as keyof Bot];
      v && botKeyValue.put(key, v);
    });

    // TODO: create index to Liber search.

    dispatch(addBot(bot));
    dispatch(push(`/bots/${bot.id}`));

    // TODO: show notification
  }
);

const botsAdapter = createEntityAdapter<Bot>();

export const botsSlice = createSlice({
  name: 'bots',
  initialState: botsAdapter.getInitialState(),
  reducers: {
    addBots: (state, action: PayloadAction<Bot[]>) =>
      botsAdapter.addMany(state, action.payload),
    addBot: (state, action: PayloadAction<Bot>) =>
      botsAdapter.addOne(state, action.payload),
  },
});

export const { addBots, addBot } = botsSlice.actions;

const selectors = botsAdapter.getSelectors();
export const selectBotById = (id: string) => (state: RootState) =>
  selectors.selectById(state.bots, id);
export const selectBotsByIds = (ids: string[]) => (state: RootState) =>
  ids.map((id) => selectors.selectById(state.bots, id));

export default botsSlice.reducer;
