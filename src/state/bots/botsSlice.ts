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
import { placeMessagesAdded } from '~/state/actionCreater';
import { Message } from '~/state/places/messagesSlice';
import { AppDispatch, RootState } from '~/state/store';
import { addIpfsContent } from '../p2p/ipfsContentsSlice';

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

export const tmpPurchased: Bot[] = [...Array(10)].map((_, i) => ({
  id: `b83e2b45-85eb-46c1-9509-3598e86d1d69${i}`,
  uid: `zdpuAtz9efzfAP8AA9iWHq7onLpDHHceqp4GyHj827H925nVn${i}`,
  category: 2,
  name: 'baku purchased',
  description: "Hey everyone. I'm baku.",
  avatar: 'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
  price: 199999,
  readme: `# Usage

hogehogehogehoge

## Links

- [http: //liber.live/](http: //liber.live/)
- [http: //docs.liber.live/](http: //docs.liber.live/)`,
  sourceCode: `
  if (message === 'ping') {
    return 'pong';
  } else if (message === 'hello') {
    return \`hi \${name}\`;
  }
  `,
  examples: [
    {
      title: 'ping',
      input: 'ping',
      output: 'pong',
    },
    {
      title: 'greeting',
      input: 'hello <@>',
      output: 'pong',
    },
  ],
  keyValAddress: 'zdpuB1UwZHJbcStBbuVgKDzEvayVw1VhXoQTkK3TWnyPA3iRh',
  created: 1622195011,
  purchased: 1622197011,
}));

export const tmpListingOn: Bot[] = [...Array(10)].map((_, i) => ({
  id: `b83e2b45-85eb-46c1-9509-3598e86d1d69${i}`,
  uid: `zdpuAtz9efzfAP8AA9iWHq7onLpDHHceqp4GyHj827H925nVn${i}`,
  category: 2,
  name: 'baku',
  description: "Hey everyone. I'm baku.",
  avatar: 'QmNQvSkZeh9SwaJL2UNWTLCwmUGa9m6xVS3GunGFKNN8nV',
  price: 199999,
  readme: `# Usage

hogehogehogehoge

## Links

- [http://liber.live/](http://liber.live/)
- [http://docs.liber.live/](http://docs.liber.live/)`,
  sourceCode: `
if (<input> === ping) {
  return 'pong';
} else if (<input> === hello) {
  return 'hi <username>';
}`,
  examples: [
    {
      title: 'ping',
      input: 'ping',
      output: 'pong',
    },
    {
      title: 'greeting',
      input: 'hello',
      output: 'hi',
    },
  ],
  keyValAddress: 'zdpuB1UwZHJbcStBbuVgKDzEvayVw1VhXoQTkK3TWnyPA3iRh',
  created: 1622195011,
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
  purchased?: number;
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

// let worker: Worker;
export const setupBotWorker = createAsyncThunk<void, void>(
  'bots/setupWorker',
  async () => {
    if (!window.Worker) {
      throw new Error(
        'Worker is not supported this browser. So you cannot run bot process.'
      );
    }
  }
);

const runWorker = (message: Message, sourceCode: string): Promise<string> => {
  const worker = new Worker('/worker.js');
  return new Promise((resolve, reject) => {
    worker.onmessage = ({ data }) => {
      resolve(data);
    };
    worker.onerror = (e) => {
      reject(e);
    };
    worker.postMessage([message, sourceCode]);
  });
};

export const runBotWorker = createAsyncThunk<
  void,
  { placeId: string; message: Message },
  { state: RootState }
>('bots/runWorker', async ({ placeId, message }, { getState, dispatch }) => {
  const bots = getState().mypageBots.purchased;
  await Promise.all(
    bots.map(async (bot) => {
      const result = await runWorker(message, bot.sourceCode);
      console.log(result);

      if (result) {
        dispatch(
          placeMessagesAdded({
            messages: [
              {
                id: uuidv4(),
                authorName: bot.name,
                uid: bot.id,
                text: result,
                timestamp: getUnixTime(new Date()),
                bot: true,
              },
            ],
            placeId,
          })
        );
      }
    })
  );
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
    };

    Object.keys(bot).forEach((key) => {
      const v = bot[key as keyof Bot];
      v && botKeyValue.put(key, v);
    });

    // TODO: create index to Liber search.

    dispatch(addBot(bot));
    dispatch(push(`/bots/${bot.keyValAddress}/${bot.id}`));

    // TODO: show notification
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

    // TODO: update index to Liber search.

    dispatch(updateOne({ id: botId, changes: partial }));
    dispatch(push(`/bots/${address}/${botId}`));

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
export const selectBotById = (id: string) => (state: RootState) =>
  selectors.selectById(state.bots, id);
export const selectBotsByIds = (ids: string[]) => (state: RootState) =>
  ids.map((id) => selectors.selectById(state.bots, id));

export default botsSlice.reducer;
