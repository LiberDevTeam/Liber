import { Mutex } from 'async-mutex';
import type { IPFS as IPFSType } from 'ipfs-core';
import * as IPFS from 'ipfs-core';

let ipfsNode: IPFSType | null;
const ipfsMutex = new Mutex();

export const getIpfsNode = async (): Promise<IPFSType> => {
  return await ipfsMutex.runExclusive<IPFSType>(async () => {
    if (!ipfsNode) {
      ipfsNode = await IPFS.create({
        repo: '/liber',
        start: true,
        preload: {
          enabled: false,
        },
        config: {
          Addresses: {
            Swarm: [
              // '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
              // '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
              // '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/',
              // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
              '/dns4/salty-temple-29450.herokuapp.com/tcp/443/wss/p2p-webrtc-star',
            ],
          },
          Bootstrap: [
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
            '/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
            '/ip4/104.131.131.82/udp/4001/quic/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
          ],
        },
      });
    }
    return ipfsNode;
  });
};

export const encrypt = async (obj: any): Promise<Uint8Array> => {
  const encoder = new TextEncoder();
  const arr = encoder.encode(JSON.stringify(obj));
  const node = await getIpfsNode();
  // @ts-ignore
  return node.libp2p.peerId.pubKey.encrypt(arr);
};

export const decrypt = async (arr: Uint8Array): Promise<Uint8Array> => {
  const node = await getIpfsNode();
  // @ts-ignore
  return node.libp2p.peerId.privKey.decrypt(arr);
};
