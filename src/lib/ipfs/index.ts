import { Mutex } from 'async-mutex';
import IPFS, { IPFS as IPFSType } from 'ipfs';
import { main } from './worker/main';

main();

let ipfsNode: IPFSType | null;
const ipfsMutex = new Mutex();

export const getIpfsNode = async (): Promise<IPFSType> => {
  return await ipfsMutex.runExclusive<IPFSType>(async () => {
    if (!ipfsNode) {
      ipfsNode = await IPFS.create({
        start: true,
        preload: {
          enabled: true,
        },
        EXPERIMENTAL: { ipnsPubsub: true },
        libp2p: {
          addresses: {
            listen: [
              '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
              '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
              '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/',
            ],
            announce: [],
            noAnnounce: [],
          },
        },
      });
    }
    return ipfsNode;
  });
};
