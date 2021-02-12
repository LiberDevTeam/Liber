// @ts-nocheck

import Libp2p from 'libp2p';
import { NOISE } from 'libp2p-noise';
import MPLEX from 'libp2p-mplex';
import WebSockets from 'libp2p-websockets';
import WebrtcStar from 'libp2p-webrtc-star';
import Gossipsub from 'libp2p-gossipsub';
import Bootstrap from 'libp2p-bootstrap';
// import KadDHT from 'libp2p-kad-dht';
import { FaultTolerance } from 'libp2p/src/transport-manager';
import RelayConstants from 'libp2p/src/circuit/constants';
import Constants from 'libp2p/src/constants';
import { dnsaddrResolver } from 'multiaddr/src/resolvers';
import { publicAddressesFirst } from 'libp2p-utils/src/address-sort';

export const createPnetLibp2pNode = (swarmKey?: string, datastore?) => {
  return Libp2p.create({
    modules: {
      transport: [WebSockets, WebrtcStar],
      streamMuxer: [MPLEX],
      connEncryption: [NOISE],
      peerDiscovery: [Bootstrap],
      connProtector: new Protector(swarmKey),
      pubsub: Gossipsub,
    },
    keychain: {
      pass: 'notsafepassword123456789',
      datastore: new MemoryDatastore(),
    },
  });
};

export const libp2pOptions = {
  // export const publicLibp2pOptions = {
  start: true,
  // dialer: {
  //   maxParallelDials: 150, // 150 total parallel multiaddr dials
  //   maxDialsPerPeer: 4, // Allow 4 multiaddrs to be dialed per peer in parallel
  //   dialTimeout: 10e3 // 10 second dial timeout per peer dial
  // },
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
    transport: [WebSockets, WebrtcStar],
    streamMuxer: [MPLEX],
    connEncryption: [NOISE],
    peerDiscovery: [Bootstrap],
    // dht: KadDHT,
    pubsub: Gossipsub,
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
      // bootstrap: {
      //   enabled: true
      // },
      // [WebRTCStar.discovery.tag]
      // webRTCStar: {
      //   enabled: true
      // }
    },
    // dht: {
    //   kBucketSize: 20,
    //   enabled: false,
    //   clientMode: true,
    //   randomWalk: {
    //     enabled: false
    //   },
    // validators: {
    //   ipns: ipnsUtils.validator
    // },
    // selectors: {
    //   ipns: ipnsUtils.selector
    // }
    // },
    pubsub: {
      enabled: true,
      // emitSelf: true
    },
    // nat: {
    //   enabled: true
    // }
  },
  // metrics: {
  //   enabled: true
  // },
  // peerStore: {
  //   persistence: true,
  //   threshold: 1
  // }
};

export const publicLibp2pOptions = {
  start: true,
  modules: {
    transport: [WebSockets, WebrtcStar],
    streamMuxer: [MPLEX],
    connEncryption: [NOISE],
    peerDiscovery: [Bootstrap],
    // dht: KadDHT,
    pubsub: Gossipsub,
  },
  addresses: {
    listen: [
      '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
      '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
    ],
    announce: [],
    noAnnounce: [],
  },
  connectionManager: {
    minConnections: 25,
  },
  transportManager: {
    faultTolerance: FaultTolerance.FATAL_ALL,
  },
  dialer: {
    maxParallelDials: Constants.MAX_PARALLEL_DIALS,
    maxDialsPerPeer: Constants.MAX_PER_PEER_DIALS,
    dialTimeout: Constants.DIAL_TIMEOUT,
    resolvers: {
      dnsaddr: dnsaddrResolver,
    },
    addressSorter: publicAddressesFirst,
  },
  metrics: {
    enabled: false,
  },
  peerStore: {
    persistence: false,
    threshold: 5,
  },
  peerRouting: {
    refreshManager: {
      enabled: true,
      interval: 6e5,
      bootDelay: 10e3,
    },
  },
  config: {
    dht: {
      enabled: false,
      kBucketSize: 20,
      randomWalk: {
        enabled: false, // disabled waiting for https://github.com/libp2p/js-libp2p-kad-dht/issues/86
        queriesPerPeriod: 1,
        interval: 300e3,
        timeout: 10e3,
      },
    },
    nat: {
      enabled: true,
      ttl: 7200,
      keepAlive: true,
      gateway: null,
      externalIp: null,
      pmp: {
        enabled: false,
      },
    },
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
    },
    pubsub: {
      enabled: true,
    },
    relay: {
      enabled: true,
      advertise: {
        bootDelay: RelayConstants.ADVERTISE_BOOT_DELAY,
        enabled: false,
        ttl: RelayConstants.ADVERTISE_TTL,
      },
      hop: {
        enabled: false,
        active: false,
      },
      autoRelay: {
        enabled: false,
        maxListeners: 2,
      },
    },
    transport: {},
  },
};
