import { basicNodeSigner } from '@stellar/stellar-sdk/contract'
import { importWalletFromMnemonic, SILVER_TOKEN_OWNER_SEED_PHRASE } from '../index'
import * as Client from '../../packages/silver/dist/index'
import { Horizon } from 'stellar-sdk'

const rpcUrl = 'https://soroban-testnet.stellar.org'
const networkPassphrase = 'Test SDF Network ; September 2015'

const contractId = 'CCI7LXBUZ2P456CKR6UNOESZMDEWTEGJH77UOKTJPLXZB3O4DUAIPU67'
const wasmHash = 'a50e2bad383fa69f0eee1b3a75e3ff97f1f404a6abdd1dc1f5cf0ef9655d0a33'
const server = new Horizon.Server('https://horizon-testnet.stellar.org')

;(async () => {
  const adminKeypair = await importWalletFromMnemonic(SILVER_TOKEN_OWNER_SEED_PHRASE)

  const account = await server.loadAccount(adminKeypair.publicKey())
  const { signTransaction } = createCustomSigner(adminKeypair, networkPassphrase, rpcUrl)

  const contract = new Client.Client({
    ...Client.networks.testnet,
    rpcUrl,
    signTransaction,
  })

  const recipient = adminKeypair.publicKey()

  const resultInit = await (await contract.init({ admin: adminKeypair.publicKey() })).signAndSend()
  console.log('result init', resultInit)

  const result = await contract.mint({
    to: recipient,
    amount: 1000n,
  })

  const txResult = await result.signAndSend({
    signTransaction, // required because `require_auth()` is called inside the contract
  })

  console.log('Mint result:', txResult)

  console.log('result', result)
})()

function createCustomSigner(keypair, networkPassphrase, rpcUrl) {
  return {
    async signTransaction(txBuilder) {
      const account = await server.loadAccount(keypair.publicKey())

      txBuilder.setTimeout(60)
      txBuilder.setSequenceNumber(account.sequenceNumber())

      const tx = txBuilder.build()
      tx.sign(keypair)
      return tx
    },
  }
}
