import { Horizon, Networks } from '@stellar/stellar-sdk'

export const server = new Horizon.Server('https://horizon-testnet.stellar.org')
export const network = Networks.TESTNET

export const getAccountDetails = async (publicKey: string) => {
  try {
    const account = await server.loadAccount(publicKey)
    return account
  } catch (error) {
    throw new Error('Failed to load account details')
  }
}

export const getAccountBalance = async (publicKey: string) => {
  try {
    const account = await getAccountDetails(publicKey)
    const nativeBalance = account.balances.find((balance) => balance.asset_type === 'native')
    return nativeBalance ? nativeBalance.balance : '0'
  } catch (error) {
    return '0'
  }
}
