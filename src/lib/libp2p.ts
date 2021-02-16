// @ts-nocheck

import { NOISE } from 'libp2p-noise';
import MPLEX from 'libp2p-mplex';
import WebrtcStar from 'libp2p-webrtc-star';
import Gossipsub from 'libp2p-gossipsub';
import Bootstrap from 'libp2p-bootstrap';
import MulticastDNS from 'libp2p-mdns';
import { FaultTolerance } from 'libp2p/src/transport-manager';
import RelayConstants from 'libp2p/src/circuit/constants';
import Constants from 'libp2p/src/constants';
import { dnsaddrResolver } from 'multiaddr/src/resolvers';
import { publicAddressesFirst } from 'libp2p-utils/src/address-sort';
import KadDHT from 'libp2p-kad-dht';

export const publicLibp2pOptions = {
  start: true,
  modules: {
    transport: [WebrtcStar],
    streamMuxer: [MPLEX],
    connEncryption: [NOISE],
    peerDiscovery: [Bootstrap, MulticastDNS],
    dht: KadDHT,
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
          '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
          '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
          '/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
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
