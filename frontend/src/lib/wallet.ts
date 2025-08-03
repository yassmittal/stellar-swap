'use client'

import {
  allowAllModules,
  FREIGHTER_ID,
  StellarWalletsKit,
  WalletNetwork,
} from '@creit.tech/stellar-wallets-kit'

const SELECTED_WALLET_ID = 'selectedWalletId'

function getSelectedWalletId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(SELECTED_WALLET_ID) as string | null
}

const kit = new StellarWalletsKit({
  modules: allowAllModules(),
  network: process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE! as WalletNetwork,
  selectedWalletId: getSelectedWalletId() ?? FREIGHTER_ID,
})

export const signTransaction = kit.signTransaction.bind(kit)

export async function getPublicKey(): Promise<string | null> {
  const walletId = getSelectedWalletId()
  if (!walletId) return null
  const { address } = await kit.getAddress()
  return address
}

export async function setWallet(walletId: string): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SELECTED_WALLET_ID, walletId)
  }
  kit.setWallet(walletId)
}

export async function disconnect(callback?: () => Promise<void>): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SELECTED_WALLET_ID)
  }
  kit.disconnect()
  if (callback) await callback()
}

export async function connect(callback?: () => Promise<void>): Promise<void> {
  await kit.openModal({
    onWalletSelected: async (option) => {
      try {
        await setWallet(option.id)
        if (callback) await callback()
      } catch (e) {
        console.error(e)
      }
      return option.id
    },
  })
}
