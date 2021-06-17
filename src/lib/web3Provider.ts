import { InjectedConnector } from '@web3-react/injected-connector';
import web3 from 'web3';
//import { NetworkConnector } from "@web3-react/network-connector";
//import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
//import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import type { provider } from 'web3-core';

/* connector */
// const POLLING_INTERVAL = 8000;

export const injectedConnecter = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});
/* temporary mock parameters
export const networkConnector = new NetworkConnector({
  urls: { 1: "https://mainnet.infura.io/v3/example" },
  defaultChainId: 1,
});
*/
/*
export const walletConnecter = new WalletConnectConnector({
  rpc: { 1: "https://mainnet.infura.io/v3/example" },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
});
*/
/*
export const walletLinkConnecter = new WalletLinkConnector({
  url: "example.com",
  appName: "Liber",
});
*/

/* getLibrary function */
export const getLibrary = (provider: provider): web3 => {
  return new web3(provider);
};
