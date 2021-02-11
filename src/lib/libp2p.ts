// @ts-nocheck

import Libp2p from 'libp2p';
import { NOISE } from 'libp2p-noise';
import MPLEX from 'libp2p-mplex';
import WebSockets from 'libp2p-websockets';
import WebRtcStar from 'libp2p-webrtc-star';
import { MemoryDatastore } from 'interface-datastore';
import Gossipsub from 'libp2p-gossipsub';
import Bootstrap from 'libp2p-bootstrap';

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
      pubsub: Gossipsub,
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
      datastore: new MemoryDatastore(),
    },
  });
};

export const createPnetLibp2pNode = (swarmKey?: string, datastore?) => {
  return Libp2p.create({
    modules: {
      transport: [WebSockets, WebRtcStar],
      streamMuxer: [MPLEX],
      connEncryption: [NOISE],
      peerDiscovery: [],
      connProtector: new Protector(swarmKey),
      pubsub: Gossipsub,
    },
    keychain: {
      pass: 'notsafepassword123456789',
      datastore: new MemoryDatastore(),
    },
  });
};
