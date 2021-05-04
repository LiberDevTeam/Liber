import { Mutex } from 'async-mutex';
import OrbitDB from 'orbit-db';
import { getIpfsNode } from '../ipfs';

let orbitDB: OrbitDB | null;

const orbitDBMutex = new Mutex();

export const getOrbitDB = async (): Promise<OrbitDB> => {
  return await orbitDBMutex.runExclusive<OrbitDB>(async () => {
    if (!orbitDB) {
      orbitDB = await OrbitDB.createInstance(await getIpfsNode());
    }
    return orbitDB;
  });
};
