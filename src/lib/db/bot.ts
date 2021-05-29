import KeyValueStore from 'orbit-db-kvstore';
import { Bot, Example } from '~/state/bots/botsSlice';
import { getOrbitDB } from './orbit';

type BotDBValue = string | Example[] | number | boolean;

const botDB: Record<string, KeyValueStore<BotDBValue>> = {};

export const createBotKeyValue = async (
  botId: string
): Promise<KeyValueStore<BotDBValue>> => {
  const orbitDB = await getOrbitDB();
  const db = await orbitDB.keyvalue<BotDBValue>(`${botId}/bot`, {
    accessController: { write: ['*'] },
  });
  botDB[db.address.root] = db;
  await db.load();
  return db;
};

export const readBotFromDB = (kv: KeyValueStore<BotDBValue>): Bot => {
  return {
    id: kv.get('id') as string,
    uid: kv.get('uid') as string,
    category: kv.get('category') as number,
    name: kv.get('name') as string,
    price: kv.get('price') as number,
    avatar: kv.get('avatar') as string,
    readme: kv.get('readme') as string,
    sourceCode: kv.get('sourceCode') as string,
    description: kv.get('description') as string,
    examples: kv.get('examples') as Example[],
    keyValAddress: kv.get('keyValAddress') as string,
    created: kv.get('created') as number,
  };
};

export const connectBotKeyValue = async ({
  botId,
  address,
}: {
  botId: string;
  address: string;
}): Promise<KeyValueStore<BotDBValue>> => {
  const orbitDB = await getOrbitDB();

  const db = await orbitDB.keyvalue<BotDBValue>(
    `/orbitdb/${address}/${botId}/bot`
  );
  botDB[botId] = db;
  await db.load();
  return db;

  // return new Promise<KeyValueStore<BotDBValue>>((resolve) => {
  //   db.events.on('ready', () => {
  //     console.log('ready!!!!!!!!!!!!!!');
  //     console.log(db.get('data'));
  //   });
  //   db.events.on('replicate.progress', (_0, _1, _2, progress, have) => {
  //     if (progress === have) {
  //       resolve(db);
  //     }
  //   });
  //   db.load();
  // });
};
