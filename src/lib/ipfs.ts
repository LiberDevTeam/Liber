// @ts-nocheck

import WS from 'libp2p-websockets';
import WebRTCStar from 'libp2p-webrtc-star';
import Multiplex from 'libp2p-mplex';
import { NOISE } from 'libp2p-noise';
import KadDHT from 'libp2p-kad-dht';
import GossipSub from 'libp2p-gossipsub';
import Bootstrap from 'libp2p-bootstrap';

export const options = {
  start: true,
  dialer: {
    maxParallelDials: 150, // 150 total parallel multiaddr dials
    maxDialsPerPeer: 4, // Allow 4 multiaddrs to be dialed per peer in parallel
    dialTimeout: 10e3, // 10 second dial timeout per peer dial
  },
  modules: {
    transport: [WS, WebRTCStar],
    streamMuxer: [Multiplex],
    connEncryption: [NOISE],
    peerDiscovery: [],
    dht: KadDHT,
    pubsub: GossipSub,
  },
  config: {
    peerDiscovery: {
      autoDial: true,
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
      bootstrap: {
        enabled: true,
      },
      // [WebRTCStar.discovery.tag]
      webRTCStar: {
        enabled: true,
      },
    },
    dht: {
      kBucketSize: 20,
      enabled: false,
      clientMode: true,
      randomWalk: {
        enabled: false,
      },
      // validators: {
      //   ipns: ipnsUtils.validator
      // },
      // selectors: {
      //   ipns: ipnsUtils.selector
      // }
    },
    pubsub: {
      enabled: true,
      emitSelf: true,
    },
    nat: {
      enabled: false,
    },
  },
  metrics: {
    enabled: true,
  },
  peerStore: {
    persistence: true,
    threshold: 1,
  },
};
