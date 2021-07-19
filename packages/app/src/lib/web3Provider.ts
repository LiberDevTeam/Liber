import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import web3 from 'web3';
//import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import type { provider } from 'web3-core';

/* Ethereum ChainID Enum */
export enum EthereumChain {
  'MAIN' = 1,
  'ROPSTEN' = 3,
  'RINKEBY' = 4,
  'KOVAN' = 42,
  'LOCAL' = Number(process.env.CHAIN_ID) || 0,
}

/* connector */
const SUPPORT_CHAINIDS = [
  EthereumChain.MAIN,
  EthereumChain.ROPSTEN,
  EthereumChain.RINKEBY,
  EthereumChain.KOVAN,
  EthereumChain.LOCAL,
];

const defaultChainId =
  process.env.NODE_ENV === 'development' && EthereumChain.LOCAL !== 0
    ? EthereumChain.LOCAL
    : EthereumChain.ROPSTEN;

export const injectedConnecter = new InjectedConnector({
  supportedChainIds: SUPPORT_CHAINIDS,
});

export const networkConnector = new NetworkConnector({
  urls: SUPPORT_CHAINIDS.reduce(
    (
      accm,
      chainId
    ): {
      [chainId: number]: string;
    } => {
      return {
        ...accm,
        [chainId]: `https://${process.env.INFURA_ENDPOINT}${process.env.INFURA_ID}`,
      };
    },
    {}
  ),
  defaultChainId,
});

export const walletConnecter = new WalletConnectConnector({
  infuraId: process.env.INFURA_ID,
});
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
