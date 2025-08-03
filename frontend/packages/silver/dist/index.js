import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CC6LQS7IHPZFC3H2FVSBOONKNSEYYJNE4INYVVI37RLX2IF4MYSFGSCD",
    }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAAAAAAAAAAAEaW5pdAAAAAEAAAAAAAAABWFkbWluAAAAAAAAEwAAAAA=",
            "AAAAAAAAAAAAAAAEbmFtZQAAAAAAAAABAAAAEA==",
            "AAAAAAAAAAAAAAAGc3ltYm9sAAAAAAAAAAAAAQAAABA=",
            "AAAAAAAAAAAAAAAIZGVjaW1hbHMAAAAAAAAAAQAAAAQ=",
            "AAAAAAAAAAAAAAALZGVzY3JpcHRpb24AAAAAAAAAAAEAAAAQ",
            "AAAAAAAAAAAAAAAIaWNvbl91cmwAAAAAAAAAAQAAABA=",
            "AAAAAAAAAAAAAAAEbWludAAAAAIAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
            "AAAAAAAAAAAAAAAKYmFsYW5jZV9vZgAAAAAAAQAAAAAAAAAEdXNlcgAAABMAAAABAAAACw==",
            "AAAAAAAAAAAAAAAEYnVybgAAAAIAAAAAAAAABGZyb20AAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA"]), options);
        this.options = options;
    }
    fromJSON = {
        init: (this.txFromJSON),
        name: (this.txFromJSON),
        symbol: (this.txFromJSON),
        decimals: (this.txFromJSON),
        description: (this.txFromJSON),
        icon_url: (this.txFromJSON),
        mint: (this.txFromJSON),
        balance_of: (this.txFromJSON),
        burn: (this.txFromJSON)
    };
}
