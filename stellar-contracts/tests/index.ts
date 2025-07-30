const SILVER_COIN_ADDRESS = 'CC6LQS7IHPZFC3H2FVSBOONKNSEYYJNE4INYVVI37RLX2IF4MYSFGSCD'

import * as bip39 from 'bip39'
import * as ed25519 from 'ed25519-hd-key'
import StellarSDK, {
  Address,
  Asset,
  BASE_FEE,
  nativeToScVal,
  Networks,
  Operation,
  TransactionBuilder,
  rpc as StellarRpc,
} from 'stellar-sdk'
import * as StellarSdk from '@stellar/stellar-sdk'
import { Buffer } from 'buffer'

import { Horizon } from 'stellar-sdk'
const { Keypair, SorobanRpc, mnemonicToSeedSync, HDKey } = StellarSDK

const HORIZON_URL = 'https://horizon-testnet.stellar.org'

const RPC_URL = 'https://soroban-testnet.stellar.org:443'
// const SILVER_COIN_ADDRESS = 'CCI7LXBUZ2P456CKR6UNOESZMDEWTEGJH77UOKTJPLXZB3O4DUAIPU67'
const rpc = new StellarRpc.Server(RPC_URL, { allowHttp: true })

export const SILVER_TOKEN_OWNER_SEED_PHRASE =
  'utility blue loan nation position poem trend tomorrow panic ring fringe view slow decrease lottery neglect wheat program expire always boost sand will adult'

const UI_WALLET_SEED_PHRASE =
  'patient random priority slender foot bleak secret real job crystal session sibling'
const server = new Horizon.Server('https://horizon-testnet.stellar.org')

// Derive Keypair from mnemonic
export async function importWalletFromMnemonic(mnemonic: string): Promise<Keypair> {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic')
  }

  const seed = await bip39.mnemonicToSeed(mnemonic)
  const derived = ed25519.derivePath("m/44'/148'/0'", seed) // Stellar BIP44 path
  return Keypair.fromRawEd25519Seed(derived.key)
}

// Generic function to get balance
export async function getBalance(
  publicKey: string,
  assetCode = 'XLM',
  assetIssuer?: string
): Promise<string> {
  console.log('public key', publicKey)
  console.log('assetCode', assetCode)
  console.log('assetIssuer', assetIssuer)
  const account = await server.loadAccount(publicKey)

  if (assetCode === 'XLM') {
    const native = account.balances.find((b) => b.asset_type === 'native')
    return native?.balance ?? '0'
  }

  const token = account.balances.find(
    (b) => b.asset_code === assetCode && b.asset_issuer === assetIssuer
  )

  return token?.balance ?? '0'
}

export async function transferXLM({
  senderMnemonic,
  recipientPublicKey,
  amount,
}: {
  senderMnemonic: string
  recipientPublicKey: string
  amount: string
}) {
  const senderKeypair = await getKeypairFromMnemonic(senderMnemonic)

  const account = await server.loadAccount(senderKeypair.publicKey())

  const transaction = new TransactionBuilder(account, {
    fee: await server.fetchBaseFee(),
    networkPassphrase: Networks.PUBLIC, // Use Networks.TESTNET for testnet
  })
    .addOperation(
      Operation.payment({
        destination: recipientPublicKey,
        asset: new Asset('SILVER', SILVER_COIN_ADDRESS),
        amount,
      })
    )
    .setTimeout(30)
    .build()

  // Sign transaction
  transaction.sign(senderKeypair)

  // Submit transaction
  const result = await server.submitTransaction(transaction)
  console.log('✅ Transaction successful!')
  console.log(`🔗 Explorer: https://stellarscan.io/tx/${result.hash}`)

  return result
}

// async function mintToken() {
//   const keypair = await importWalletFromMnemonic(SILVER_TOKEN_OWNER_SEED_PHRASE)
//   const publicKey = keypair.publicKey()
//   const account = await rpc.getAccount(publicKey)

//   const recipient = new Address(publicKey)
//   const amount = nativeToScVal('1000', { type: 'u128' })

//   let tx = new TransactionBuilder(account, {
//     fee: BASE_FEE,
//     networkPassphrase: Networks.TESTNET, // or FUTURENET if you deployed there
//   })
//     .addOperation(
//       Operation.invokeContractFunction({
//         contract: SILVER_COIN_ADDRESS,
//         function: 'mint',
//         args: [new Address(publicKey).toScVal(), recipient.toScVal(), amount],
//       })
//     )
//     .setTimeout(30)
//     .build()

//   const simResponse = await rpc.simulateTransaction(tx)

//   if (StellarRpc.Api.isSimulationRestore(simResponse)) {
//     console.warn('❗ Contract footprint needs restoration')
//     // Handle the restoreFootprint logic (see full docs)
//     return
//   }

//   if (!StellarRpc.Api.isSimulationSuccess(simResponse)) {
//     throw new Error('Simulation failed: ' + JSON.stringify(simResponse))
//   }

//   tx = StellarRpc.assembleTransaction(tx, simResponse)

//   tx.sign(keypair)
//   const sendRes = await rpc.sendTransaction(tx)

//   console.log('✅ Mint sent. Hash:', sendRes.hash)
// }

async function main() {
  const keypair = await importWalletFromMnemonic(SILVER_TOKEN_OWNER_SEED_PHRASE)

  console.log('Public Key:', keypair.publicKey())
  const xlmBalance = await getBalance(keypair.publicKey())
  console.log('XLM Balance:', xlmBalance)
  const silverBalance = await getBalance(keypair.publicKey(), 'SILVER', SILVER_COIN_ADDRESS)
  console.log('SILVER Balance:', silverBalance)

  mintTokens(keypair, 'GBJRKATOCB4OHYD4HRDK5ZFUDMVXQ2KR3NLWBGRNOIW25FAC5Q2ZAQ4E')
  console.log('Token minted successfully')
}

main().catch(console.error)

export function generateKeyPairFromMnemonic(mnemonic: string): Keypair {
  const seed = mnemonicToSeedSync(mnemonic)
  const hdkey = HDKey.fromMasterSeed(seed)
  const key = hdkey.derive("m/44'/148'/0'")
  return Keypair.fromRawEd25519Seed(key.privateKey!)
}

const networkPassphrase = StellarSdk.Networks.TESTNET

const MINT_AMOUNT = 1000 // Amount to mint (in token units)

// Function to build and submit the mint transaction
async function mintTokens(keypair: StellarSdk.Keypair, receiverAddress: string): Promise<void> {
  try {
    // Load issuer account
    const issuerAccount = await server.loadAccount(keypair.publicKey())

    // Build the contract invocation operation
    const contract = new StellarSdk.Contract(SILVER_COIN_ADDRESS)

    // Create the mint function call
    const mintCall = contract.call(
      'mint', // Function name
      // Convert parameters to SCVal
      StellarSdk.Address.fromString(receiverAddress).toScVal(), // Recipient address
      StellarSdk.nativeToScVal(BigInt(MINT_AMOUNT * 10000000)) // Amount (assuming 7 decimal places)
    )

    // Build transaction
    const transaction = new StellarSdk.TransactionBuilder(issuerAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: networkPassphrase,
    })
      .addOperation(mintCall)
      .setTimeout(30)
      .build()

    // Sign transaction
    transaction.sign(keypair)

    // Submit transaction
    console.log('Submitting mint transaction...')
    const submitResult = await server.submitTransaction(transaction)
    console.log('Transaction successful! Hash:', submitResult.hash)
  } catch (error) {
    console.error('Error minting tokens:', error)
    if (error.response?.data?.extras?.result_codes) {
      console.error('Result codes:', error.response.data.extras.result_codes)
    }
  }
}

// Execute the mint function
// mintTokens().catch(console.error)
