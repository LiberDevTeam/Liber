/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from 'bn.js';
import { EventData, PastEventOptions } from 'web3-eth-contract';

export interface LiberMarketContract
  extends Truffle.Contract<LiberMarketInstance> {
  'new'(meta?: Truffle.TransactionDetails): Promise<LiberMarketInstance>;
}

export interface ListItem {
  name: 'ListItem';
  args: {
    itemId: BN;
    listedOwner: string;
    price: BN;
    0: BN;
    1: string;
    2: BN;
  };
}

export interface Paused {
  name: 'Paused';
  args: {
    account: string;
    0: string;
  };
}

export interface RoleAdminChanged {
  name: 'RoleAdminChanged';
  args: {
    role: string;
    previousAdminRole: string;
    newAdminRole: string;
    0: string;
    1: string;
    2: string;
  };
}

export interface RoleGranted {
  name: 'RoleGranted';
  args: {
    role: string;
    account: string;
    sender: string;
    0: string;
    1: string;
    2: string;
  };
}

export interface RoleRevoked {
  name: 'RoleRevoked';
  args: {
    role: string;
    account: string;
    sender: string;
    0: string;
    1: string;
    2: string;
  };
}

export interface UnListItem {
  name: 'UnListItem';
  args: {
    itemId: BN;
    0: BN;
  };
}

export interface Unpaused {
  name: 'Unpaused';
  args: {
    account: string;
    0: string;
  };
}

type AllEvents =
  | ListItem
  | Paused
  | RoleAdminChanged
  | RoleGranted
  | RoleRevoked
  | UnListItem
  | Unpaused;

export interface LiberMarketInstance extends Truffle.ContractInstance {
  BANNED_ROLE(txDetails?: Truffle.TransactionDetails): Promise<string>;

  DEFAULT_ADMIN_ROLE(txDetails?: Truffle.TransactionDetails): Promise<string>;

  PAUSER_ROLE(txDetails?: Truffle.TransactionDetails): Promise<string>;

  /**
   * Returns the admin role that controls `role`. See {grantRole} and {revokeRole}. To change a role's admin, use {_setRoleAdmin}.
   */
  getRoleAdmin(
    role: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  /**
   * Returns one of the accounts that have `role`. `index` must be a value between 0 and {getRoleMemberCount}, non-inclusive. Role bearers are not sorted in any particular way, and their ordering may change at any point. WARNING: When using {getRoleMember} and {getRoleMemberCount}, make sure you perform all queries on the same block. See the following https://forum.openzeppelin.com/t/iterating-over-elements-on-enumerableset-in-openzeppelin-contracts/2296[forum post] for more information.
   */
  getRoleMember(
    role: string,
    index: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  /**
   * Returns the number of accounts that have `role`. Can be used together with {getRoleMember} to enumerate all bearers of a role.
   */
  getRoleMemberCount(
    role: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  /**
   * Overload {grantRole} to track enumerable memberships
   */
  grantRole: {
    (
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Returns `true` if `account` has been granted `role`.
   */
  hasRole(
    role: string,
    account: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  /**
   * Returns true if the contract is paused, and false otherwise.
   */
  paused(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

  /**
   * Returns the payments owed to an address.
   * @param dest The creditor's address.
   */
  payments(dest: string, txDetails?: Truffle.TransactionDetails): Promise<BN>;

  /**
   * Overload {renounceRole} to track enumerable memberships
   */
  renounceRole: {
    (
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Overload {revokeRole} to track enumerable memberships
   */
  revokeRole: {
    (
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * See {IERC165-supportsInterface}.
   */
  supportsInterface(
    interfaceId: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  /**
   * Withdraw accumulated payments, forwarding all gas to the recipient. Note that _any_ account can call this function, not just the `payee`. This means that contracts unaware of the `PullPayment` protocol can still receive funds this way, by having a separate account call {withdrawPayments}. WARNING: Forwarding all gas opens the door to reentrancy vulnerabilities. Make sure you trust the recipient, or are either following the checks-effects-interactions pattern or using {ReentrancyGuard}.
   * @param payee Whose payments will be withdrawn.
   */
  withdrawPayments: {
    (payee: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(payee: string, txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(
      payee: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      payee: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  pause: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  unPause: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  listToken: {
    (
      token: string,
      tokenId: number | BN | string,
      price: number | BN | string,
      isSale: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      token: string,
      tokenId: number | BN | string,
      price: number | BN | string,
      isSale: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      token: string,
      tokenId: number | BN | string,
      price: number | BN | string,
      isSale: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      token: string,
      tokenId: number | BN | string,
      price: number | BN | string,
      isSale: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  unlistToken: {
    (id: number | BN | string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      id: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      id: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      id: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  buyToken: {
    (
      id: number | BN | string,
      tip: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      id: number | BN | string,
      tip: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      id: number | BN | string,
      tip: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      id: number | BN | string,
      tip: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  setSale: {
    (
      id: number | BN | string,
      isSale: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      id: number | BN | string,
      isSale: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      id: number | BN | string,
      isSale: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      id: number | BN | string,
      isSale: boolean,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  setPrice: {
    (
      id: number | BN | string,
      price: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      id: number | BN | string,
      price: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      id: number | BN | string,
      price: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      id: number | BN | string,
      price: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  getDetailByItemId(
    id: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ 0: string; 1: BN; 2: BN; 3: BN; 4: boolean }>;

  methods: {
    BANNED_ROLE(txDetails?: Truffle.TransactionDetails): Promise<string>;

    DEFAULT_ADMIN_ROLE(txDetails?: Truffle.TransactionDetails): Promise<string>;

    PAUSER_ROLE(txDetails?: Truffle.TransactionDetails): Promise<string>;

    /**
     * Returns the admin role that controls `role`. See {grantRole} and {revokeRole}. To change a role's admin, use {_setRoleAdmin}.
     */
    getRoleAdmin(
      role: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    /**
     * Returns one of the accounts that have `role`. `index` must be a value between 0 and {getRoleMemberCount}, non-inclusive. Role bearers are not sorted in any particular way, and their ordering may change at any point. WARNING: When using {getRoleMember} and {getRoleMemberCount}, make sure you perform all queries on the same block. See the following https://forum.openzeppelin.com/t/iterating-over-elements-on-enumerableset-in-openzeppelin-contracts/2296[forum post] for more information.
     */
    getRoleMember(
      role: string,
      index: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    /**
     * Returns the number of accounts that have `role`. Can be used together with {getRoleMember} to enumerate all bearers of a role.
     */
    getRoleMemberCount(
      role: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    /**
     * Overload {grantRole} to track enumerable memberships
     */
    grantRole: {
      (
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Returns `true` if `account` has been granted `role`.
     */
    hasRole(
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    /**
     * Returns true if the contract is paused, and false otherwise.
     */
    paused(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

    /**
     * Returns the payments owed to an address.
     * @param dest The creditor's address.
     */
    payments(dest: string, txDetails?: Truffle.TransactionDetails): Promise<BN>;

    /**
     * Overload {renounceRole} to track enumerable memberships
     */
    renounceRole: {
      (
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Overload {revokeRole} to track enumerable memberships
     */
    revokeRole: {
      (
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * See {IERC165-supportsInterface}.
     */
    supportsInterface(
      interfaceId: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    /**
     * Withdraw accumulated payments, forwarding all gas to the recipient. Note that _any_ account can call this function, not just the `payee`. This means that contracts unaware of the `PullPayment` protocol can still receive funds this way, by having a separate account call {withdrawPayments}. WARNING: Forwarding all gas opens the door to reentrancy vulnerabilities. Make sure you trust the recipient, or are either following the checks-effects-interactions pattern or using {ReentrancyGuard}.
     * @param payee Whose payments will be withdrawn.
     */
    withdrawPayments: {
      (payee: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        payee: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        payee: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        payee: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    pause: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    unPause: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    listToken: {
      (
        token: string,
        tokenId: number | BN | string,
        price: number | BN | string,
        isSale: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        token: string,
        tokenId: number | BN | string,
        price: number | BN | string,
        isSale: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        token: string,
        tokenId: number | BN | string,
        price: number | BN | string,
        isSale: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        token: string,
        tokenId: number | BN | string,
        price: number | BN | string,
        isSale: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    unlistToken: {
      (
        id: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        id: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        id: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        id: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    buyToken: {
      (
        id: number | BN | string,
        tip: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        id: number | BN | string,
        tip: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        id: number | BN | string,
        tip: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        id: number | BN | string,
        tip: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    setSale: {
      (
        id: number | BN | string,
        isSale: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        id: number | BN | string,
        isSale: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        id: number | BN | string,
        isSale: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        id: number | BN | string,
        isSale: boolean,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    setPrice: {
      (
        id: number | BN | string,
        price: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        id: number | BN | string,
        price: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        id: number | BN | string,
        price: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        id: number | BN | string,
        price: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    getDetailByItemId(
      id: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: string; 1: BN; 2: BN; 3: BN; 4: boolean }>;
  };

  getPastEvents(event: string): Promise<EventData[]>;
  getPastEvents(
    event: string,
    options: PastEventOptions,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
  getPastEvents(event: string, options: PastEventOptions): Promise<EventData[]>;
  getPastEvents(
    event: string,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
}