import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import { AppDispatch, RootState } from '~/state/store';

export const Category = {
  Analytics: 'Analytics',
  Communication: 'Communication',
  CustomerSupport: 'Customer Support',
  Design: 'Design',
  DeveloperTools: 'Developer Tools',
  FileManagement: 'File Management',
  HealthWellness: 'Health & Wellness',
  HRTeamCulture: 'HR & Team Culture',
  Marketing: 'Marketing',
  OfficeManagement: 'Office Management',
  Finance: 'Finance',
  Productivity: 'Productivity',
  ProjectManagement: 'Project Management',
  Sales: 'Sales',
  SecurityCompliance: 'Security & Compliance',
  SocialFun: 'Social & Fun',
  Travel: 'Travel',
  VoiceVideo: 'Voice & Video',
  MediaNews: 'Media & News',
};

export const tmpPurchased: Bot[] = [...Array(10)].map((_, i) => ({
  id: `9C095752-A668-4BCB-A61C-7083585BDCD${i}`,
  uid: `94801C77-68E9-4193-B253-C91983477A0${i}`,
  name: 'Greeting Bot',
  description:
    'Records the attendance times and calculates the monthly wages of employees',
  docs: `
# Greeting Bot

## Usage

## Links
- github.com/LiberDevTeam/Liber
`,
  avatar: 'QmYxKHa7mrEo46YK86HYbSxcjPLbLwDT6aXuL5XzKA3hEJ',
  price: 20,
  code: `
if (<input> === ping) {
  return 'pong';
} else if (<input> === hello) {
  return 'hi <username>';
}
`,
  created: 1619251130,
  category: Category.Communication,
  testCases: [
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
  docs: `
# Greeting Bot

## Usage

## Links
- github.com/LiberDevTeam/Liber
`,
  avatar: 'QmYxKHa7mrEo46YK86HYbSxcjPLbLwDT6aXuL5XzKA3hEJ',
  price: 20,
  code: `
if (<input> === ping) {
  return 'pong';
} else if (<input> === hello) {
  return 'hi <username>';
}
`,
  created: 1619251130,
  category: Category.Communication,
  testCases: [
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

export interface TestCase {
  title: string;
  input: string;
  output: string;
}

export interface Bot {
  id: string;
  uid: string;
  name: string;
  category: string;
  description: string;
  avatar: string;
  price: number;
  docs: string;
  code: string;
  testCases: TestCase[];
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
