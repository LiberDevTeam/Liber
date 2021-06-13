import { Mutex } from 'async-mutex';
import Ipfs, { IPFS as IPFSType } from 'ipfs';
import uint8ArrayFromString from 'uint8arrays/from-string';

let ipfsNode: IPFSType | null;
const ipfsMutex = new Mutex();

export const getIpfsNode = async (): Promise<IPFSType> => {
  return await ipfsMutex.runExclusive<IPFSType>(async () => {
    if (!ipfsNode) {
      ipfsNode = await Ipfs.create({
        repo: '/liber',
        start: true,
        preload: {
          enabled: false,
        },
        config: {
          Addresses: {
            Swarm: [
              '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
              '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
              '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/',
              // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
              '/dns4/salty-temple-29450.herokuapp.com/tcp/443/wss/p2p-webrtc-star',
            ],
          },
        },
      });
    }
    return ipfsNode;
  });
};

export const encrypt = async (obj: any): Promise<Uint8Array> => {
  const arr = uint8ArrayFromString(JSON.stringify(obj));
  const node = await getIpfsNode();
  // @ts-ignore
  return node.libp2p.peerId.pubKey.encrypt(arr);
};

export const decrypt = async (arr: Uint8Array): Promise<Uint8Array> => {
  const node = await getIpfsNode();
  // @ts-ignore
  return node.libp2p.peerId.privKey.decrypt(arr);
};
