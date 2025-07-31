import * as StellarSdk from '@stellar/stellar-sdk'
import * as bip39 from 'bip39'
import * as ed25519 from 'ed25519-hd-key'

import { isConnected, signTransaction } from '@stellar/freighter-api'

// Constants
const SILVER_COIN_ADDRESS = 'CC6LQS7IHPZFC3H2FVSBOONKNSEYYJNE4INYVVI37RLX2IF4MYSFGSCD'
const HORIZON_URL = 'https://horizon-testnet.stellar.org'
const RPC_URL = 'https://soroban-testnet.stellar.org:443'
const SILVER_TOKEN_OWNER_SEED_PHRASE =
  'utility blue loan nation position poem trend tomorrow panic ring fringe view slow decrease lottery neglect wheat program expire always boost sand will adult'
const MINT_AMOUNT = 1000 // Amount to mint (in token units)
const RECIPIENT_ADDRESS = 'GBJRKATOCB4OHYD4HRDK5ZFUDMVXQ2KR3NLWBGRNOIW25FAC5Q2ZAQ4E'
const networkPassphrase = StellarSdk.Networks.TESTNET
const UI_WALLET_SEED_PHRASE =
  'patient random priority slender foot bleak secret real job crystal session sibling'

// Initialize servers
const server = new StellarSdk.Horizon.Server(HORIZON_URL)
const sorobanServer = new StellarSdk.SorobanRpc.Server(RPC_URL)

// Derive Keypair from mnemonic
async function importWalletFromMnemonic(mnemonic: string): Promise<StellarSdk.Keypair> {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic')
  }
  const seed = await bip39.mnemonicToSeed(mnemonic)
  const derived = ed25519.derivePath("m/44'/148'/0'", seed)
  return StellarSdk.Keypair.fromRawEd25519Seed(derived.key)
}

// Function to mint tokens
async function mintTokens(keypair: StellarSdk.Keypair, receiverAddress: string): Promise<void> {
  try {
    // Load issuer account
    const issuerAccount = await server.loadAccount(keypair.publicKey())

    // Build contract invocation
    const contract = new StellarSdk.Contract(SILVER_COIN_ADDRESS)
    const mintCall = contract.call(
      'mint',
      StellarSdk.Address.fromString(receiverAddress).toScVal(), // Recipient address
      StellarSdk.nativeToScVal(BigInt(MINT_AMOUNT * 10000000), { type: 'i128' }) // Amount (7 decimals)
    )

    // Build transaction
    const transaction = new StellarSdk.TransactionBuilder(issuerAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase,
    })
      .addOperation(mintCall)
      .setTimeout(30)
      .build()
    const preparedTx = await sorobanServer.prepareTransaction(transaction)
    preparedTx.sign(keypair)
    const signedXdr = preparedTx.toEnvelope().toXDR('base64')
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, networkPassphrase)

    // const signedXdr = await signTransaction(preparedTx.toEnvelope().toXDR('base64'), {
    //   networkPassphrase: networkPassphrase,
    // })

    // const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, networkPassphrase)

    const txResult = await sorobanServer.sendTransaction(signedTx)

    if (txResult.status !== 'PENDING') {
      throw new Error('Something went Wrong')
    }
    const hash = txResult.hash
    console.log('Hash', hash)

    console.log('Public Key:', keypair.publicKey())
    const xlmBalance = await getBalance(keypair.publicKey())
    console.log('XLM Balance:', xlmBalance)
    const silverBalance = await getBalance(keypair.publicKey(), 'SILVER', SILVER_COIN_ADDRESS)
    console.log('SILVER Balance:', silverBalance)
  } catch (error) {
    console.error('Error minting tokens:', error)
    throw error
  }
}

// Execute mint
async function main() {
  try {
    const keypair = await importWalletFromMnemonic(UI_WALLET_SEED_PHRASE)
    console.log('key pair', keypair.secret().toString())
    await mintTokens(keypair, RECIPIENT_ADDRESS)
    console.log('Tokens minted successfully')
  } catch (error) {
    console.error('Main error:', error)
  }
}

main().catch(console.error)

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

  console.log('account.balances', account.balances)

  const token = account.balances.find(
    (b) => b.asset_code === assetCode && b.asset_issuer === assetIssuer
  )

  return token?.balance ?? '0'
}
