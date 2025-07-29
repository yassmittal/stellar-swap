'use client'

import { useEffect, useState } from 'react'
import { Wallet, Copy, CheckCircle, LogOut, ChevronDown, Loader2, ExternalLink } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { useFreighter } from '@/hooks/useFreighter'
import { formatAddress } from '@/lib/utils'

const STELLAR_FAUCET_URL = 'https://friendbot.stellar.org'

export const StellerWalletButton = () => {
  const { publicKey, isConnected, connect, disconnect, connecting, error } = useFreighter()
  const [copied, setCopied] = useState(false)
  const [xlmBalance, setXlmBalance] = useState<number | undefined>()
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  const handleCopy = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleFaucetClick = () => {
    if (publicKey) {
      const faucetUrl = `${STELLAR_FAUCET_URL}?addr=${publicKey}`
      window.open(faucetUrl, '_blank', 'noopener,noreferrer')
    }
  }

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey || !isConnected) return

      setIsLoadingBalance(true)
      try {
        const response = await fetch(`https://horizon-testnet.stellar.org/accounts/${publicKey}`)
        if (response.ok) {
          const accountData = await response.json()
          const xlmBalance = accountData.balances.find(
            (balance: { asset_type: string }) => balance.asset_type === 'native'
          )
          setXlmBalance(Number.parseFloat(xlmBalance?.balance || '0'))
        }
      } catch (error) {
        console.error('Error fetching XLM balance:', error)
      } finally {
        setIsLoadingBalance(false)
      }
    }

    fetchBalance()
  }, [publicKey, isConnected])

  if (!isConnected || !publicKey) {
    return (
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={connect}
          disabled={connecting}
          className="flex items-center gap-2 px-4 py-2 bg-[#1A1B1F] rounded-full border border-[#383838] hover:border-[#4c4c4c] transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wallet className="h-4 w-4 text-[#558EB4] group-hover:text-[#1388D5] transition-colors" />
          <span className="text-white text-sm font-medium">
            {connecting ? 'Connecting...' : 'Connect Freighter'}
          </span>
          {connecting && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1B1F] rounded-full border border-[#383838] hover:border-[#4c4c4c] transition-colors group">
          <Wallet className="h-4 w-4 text-[#558EB4] group-hover:text-[#1388D5] transition-colors" />
          <span className="text-white text-sm font-medium">
            <span className="hidden sm:inline">{formatAddress(publicKey)}</span>
            <span className="sm:hidden">{formatAddress(publicKey)}</span>
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 sm:w-72 bg-[#12121266] backdrop-blur-xl border border-[#383838] rounded-2xl p-2 text-white"
        align="end"
      >
        <DropdownMenuLabel className="text-lg font-bold text-white px-2 pt-2">
          Freighter Wallet
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-[#383838]" />

        <div className="px-4 py-3 flex justify-between items-center">
          <div className="text-sm font-medium text-gray-400">Balance</div>
          <span className="text-base font-bold text-white flex items-center gap-2">
            {isLoadingBalance ? (
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            ) : (
              <>{xlmBalance?.toFixed(4) || '0.0000'} XLM</>
            )}
          </span>
        </div>

        <DropdownMenuSeparator className="bg-[#383838]" />

        <DropdownMenuItem
          onClick={handleCopy}
          className="cursor-pointer flex items-center gap-2 text-gray-300 hover:text-[#558EB4] focus:text-[#558EB4] hover:bg-[#1a1b1f] focus:bg-[#1a1b1f] rounded-lg px-4 py-2 transition-colors"
        >
          {copied ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span>{copied ? 'Copied!' : 'Copy Address'}</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleFaucetClick}
          className="cursor-pointer flex items-center gap-2 text-gray-300 hover:text-[#558EB4] focus:text-[#558EB4] hover:bg-[#1a1b1f] focus:bg-[#1a1b1f] rounded-lg px-4 py-2 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          <span>Get XLM from Faucet</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-[#383838]" />

        <DropdownMenuItem
          onClick={disconnect}
          className="cursor-pointer flex items-center gap-2 text-red-500 hover:text-red-400 focus:text-red-400 hover:bg-[#1a1b1f] focus:bg-[#1a1b1f] rounded-lg px-4 py-2 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
