import { Mutex } from 'async-mutex';
import OrbitDB from 'orbit-db';
import { getIpfsNode } from '../ipfs';
import AccessControllers from './access-controllers';

let orbitDB: OrbitDB | null;

const orbitDBMutex = new Mutex();

export const getOrbitDB = async (): Promise<OrbitDB> => {
  return await orbitDBMutex.runExclusive<OrbitDB>(async () => {
    if (!orbitDB) {
      orbitDB = await OrbitDB.createInstance(await getIpfsNode(), {
        // @ts-ignore
        AccessControllers,
      });
      console.log(orbitDB.id);
    }
    return orbitDB;
  });
};
