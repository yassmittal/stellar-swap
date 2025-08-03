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
        contractId: "CD7QVLJDW6HGXNK45RQ5F336OJ5TXOKSXQEDU5BK3MC7WXM4BIJQ6ARW",
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
        super(new ContractSpec(["AAAAAQAAAAAAAAAAAAAABU9yZGVyAAAAAAAABwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAdjbGFpbWVkAAAAAAEAAAAAAAAACmV4cGlyYXRpb24AAAAAAAYAAAAAAAAABW1ha2VyAAAAAAAAEwAAAAAAAAAKbWluX2Ftb3VudAAAAAAACwAAAAAAAAAPcmV2ZWFsZWRfc2VjcmV0AAAAA+gAAAAOAAAAAAAAAAtzZWNyZXRfaGFzaAAAAAPuAAAAIA==",
            "AAAAAAAAAAAAAAAOYW5ub3VuY2Vfb3JkZXIAAAAAAAYAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAIb3JkZXJfaWQAAAARAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAACm1pbl9hbW91bnQAAAAAAAsAAAAAAAAACmV4cGlyYXRpb24AAAAAAAYAAAAAAAAAC3NlY3JldF9oYXNoAAAAA+4AAAAgAAAAAA==",
            "AAAAAAAAAAAAAAALY2xhaW1fZnVuZHMAAAAAAgAAAAAAAAAIb3JkZXJfaWQAAAARAAAAAAAAAAZzZWNyZXQAAAAAAA4AAAAA",
            "AAAAAAAAAAAAAAAMY2FuY2VsX29yZGVyAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAhvcmRlcl9pZAAAABEAAAAA",
            "AAAAAAAAAAAAAAAJZ2V0X29yZGVyAAAAAAAAAQAAAAAAAAAIb3JkZXJfaWQAAAARAAAAAQAAA+gAAAfQAAAABU9yZGVyAAAA",
            "AAAAAAAAAAAAAAATZ2V0X3JldmVhbGVkX3NlY3JldAAAAAABAAAAAAAAAAhvcmRlcl9pZAAAABEAAAABAAAD6AAAAA4="]), options);
        this.options = options;
    }
    fromJSON = {
        announce_order: (this.txFromJSON),
        claim_funds: (this.txFromJSON),
        cancel_order: (this.txFromJSON),
        get_order: (this.txFromJSON),
        get_revealed_secret: (this.txFromJSON)
    };
}
