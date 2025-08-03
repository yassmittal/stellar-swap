import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CD7QVLJDW6HGXNK45RQ5F336OJ5TXOKSXQEDU5BK3MC7WXM4BIJQ6ARW",
  }
} as const


export interface Order {
  amount: i128;
  claimed: boolean;
  expiration: u64;
  maker: string;
  min_amount: i128;
  revealed_secret: Option<Buffer>;
  secret_hash: Buffer;
}

export interface Client {
  /**
   * Construct and simulate a announce_order transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  announce_order: ({caller, order_id, amount, min_amount, expiration, secret_hash}: {caller: string, order_id: string, amount: i128, min_amount: i128, expiration: u64, secret_hash: Buffer}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a claim_funds transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  claim_funds: ({order_id, secret}: {order_id: string, secret: Buffer}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a cancel_order transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  cancel_order: ({caller, order_id}: {caller: string, order_id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_order transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_order: ({order_id}: {order_id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<Order>>>

  /**
   * Construct and simulate a get_revealed_secret transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_revealed_secret: ({order_id}: {order_id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<Buffer>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAABU9yZGVyAAAAAAAABwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAdjbGFpbWVkAAAAAAEAAAAAAAAACmV4cGlyYXRpb24AAAAAAAYAAAAAAAAABW1ha2VyAAAAAAAAEwAAAAAAAAAKbWluX2Ftb3VudAAAAAAACwAAAAAAAAAPcmV2ZWFsZWRfc2VjcmV0AAAAA+gAAAAOAAAAAAAAAAtzZWNyZXRfaGFzaAAAAAPuAAAAIA==",
        "AAAAAAAAAAAAAAAOYW5ub3VuY2Vfb3JkZXIAAAAAAAYAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAIb3JkZXJfaWQAAAARAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAACm1pbl9hbW91bnQAAAAAAAsAAAAAAAAACmV4cGlyYXRpb24AAAAAAAYAAAAAAAAAC3NlY3JldF9oYXNoAAAAA+4AAAAgAAAAAA==",
        "AAAAAAAAAAAAAAALY2xhaW1fZnVuZHMAAAAAAgAAAAAAAAAIb3JkZXJfaWQAAAARAAAAAAAAAAZzZWNyZXQAAAAAAA4AAAAA",
        "AAAAAAAAAAAAAAAMY2FuY2VsX29yZGVyAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAhvcmRlcl9pZAAAABEAAAAA",
        "AAAAAAAAAAAAAAAJZ2V0X29yZGVyAAAAAAAAAQAAAAAAAAAIb3JkZXJfaWQAAAARAAAAAQAAA+gAAAfQAAAABU9yZGVyAAAA",
        "AAAAAAAAAAAAAAATZ2V0X3JldmVhbGVkX3NlY3JldAAAAAABAAAAAAAAAAhvcmRlcl9pZAAAABEAAAABAAAD6AAAAA4=" ]),
      options
    )
  }
  public readonly fromJSON = {
    announce_order: this.txFromJSON<null>,
        claim_funds: this.txFromJSON<null>,
        cancel_order: this.txFromJSON<null>,
        get_order: this.txFromJSON<Option<Order>>,
        get_revealed_secret: this.txFromJSON<Option<Buffer>>
  }
}