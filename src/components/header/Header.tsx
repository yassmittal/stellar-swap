'use client'

import { Badge } from '../ui/badge'
import { WalletButton } from '../WalletButton'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export const Header = () => {
  return (
    <header className="">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Stellar Swap</h1>
            <Badge>Testnet</Badge>
          </div>
          <ConnectButton />
          <WalletButton />
        </div>
      </div>
    </header>
  )
}
