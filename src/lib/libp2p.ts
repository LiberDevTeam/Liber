// @ts-nocheck

import Libp2p from 'libp2p';
import { NOISE } from 'libp2p-noise';
import MPLEX from 'libp2p-mplex';
import WebSockets from 'libp2p-websockets';
import WebRtcStar from 'libp2p-webrtc-star';
import { MemoryStore } from 'interface-datastore';

export const createLibp2pNode = (datastore?) => {
  return Libp2p.create({
    addresses: {
      // Add the signaling server address, along with our PeerId to our multiaddrs list
      // libp2p will automatically attempt to dial to the signaling server so that it can
      // receive inbound connections from other peers
      listen: [
        '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
        '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
      ],
    },
    modules: {
      transport: [WebSockets, WebRtcStar],
      streamMuxer: [MPLEX],
      connEncryption: [NOISE],
      peerDiscovery: [Bootstrap],
    },
    config: {
      peerDiscovery: {
        // The `tag` property will be searched when creating the instance of your Peer Discovery service.
        // The associated object, will be passed to the service when it is instantiated.
        [Bootstrap.tag]: {
          enabled: true,
          list: [
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
          ],
        },
      },
    },
    keychain: {
      pass: 'notsafepassword123456789',
      datastore: new MemoryStore(),
    },
  });
};

export const createPnetLibp2pNode = (datastore?) => {
  return Libp2p.create({
    modules: {
      transport: [WebSockets, WebRtcStar],
      streamMuxer: [MPLEX],
      connEncryption: [NOISE],
      peerDiscovery: [],
      connProtector: new Protector(swarmKey),
    },
    keychain: {
      pass: 'notsafepassword123456789',
      datastore: new MemoryStore(),
    },
  });
};
