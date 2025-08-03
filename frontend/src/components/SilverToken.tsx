'use client'

import { useEffect, useState } from 'react'
import { getPublicKey, signTransaction } from '@/lib/wallet'
import silver from '@/contracts/silver'

export function SilverTokenUI() {
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [description, setDescription] = useState('')
  const [iconUrl, setIconUrl] = useState('')
  const [balance, setBalance] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const pk = await getPublicKey()
      setPublicKey(pk)

      try {
        const nameTx = await silver.name()
        const symbolTx = await silver.symbol()
        const descTx = await silver.description()
        const iconTx = await silver.icon_url()

        const [nameRes, symbolRes, descRes, iconRes] = await Promise.all([
          nameTx.simulate(),
          symbolTx.simulate(),
          descTx.simulate(),
          iconTx.simulate(),
        ])

        setName(nameRes.result)
        setSymbol(symbolRes.result)
        setDescription(descRes.result)
        setIconUrl(iconRes.result)

        if (pk) {
          await fetchBalance(pk)
        }
      } catch (err) {
        console.error('Error loading token data:', err)
      }
    }

    loadData()
  }, [])

  const fetchBalance = async (key: string) => {
    try {
      const tx = await silver.balance_of({ user: key })
      const { result } = await tx.simulate()
      setBalance(result.toString())
    } catch (err) {
      console.error('Failed to fetch balance:', err)
      setBalance(null)
    }
  }

  const handleMint = async () => {
    if (!publicKey || !amount) return
    setLoading(true)

    try {
      silver.options.publicKey = publicKey
      silver.options.signTransaction = signTransaction

      const tx = await silver.mint({ to: publicKey, amount: BigInt(amount) })
      await tx.signAndSend()

      await fetchBalance(publicKey)
      setAmount('')
    } catch (err) {
      console.error('Mint failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBurn = async () => {
    if (!publicKey || !amount) return
    setLoading(true)

    try {
      silver.options.publicKey = publicKey
      silver.options.signTransaction = signTransaction

      const tx = await silver.burn({ from: publicKey, amount: BigInt(amount) })
      await tx.signAndSend()

      await fetchBalance(publicKey)
      setAmount('')
    } catch (err) {
      console.error('Burn failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md p-6 bg-zinc-900 text-white rounded-xl border border-zinc-700 space-y-4">
      <div className="flex items-center gap-4">
        {iconUrl && (
          <img
            src={iconUrl}
            alt="icon"
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div>
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-sm text-gray-400">{symbol}</p>
        </div>
      </div>

      <p className="text-gray-300 text-sm">{description}</p>

      {publicKey && (
        <div className="text-sm">
          <p className="text-gray-400 mb-1">Connected Wallet</p>
          <div className="font-mono text-white truncate">{publicKey}</div>
        </div>
      )}

      <div className="text-base">
        <strong>Balance:</strong>{' '}
        {balance === null ? (
          <span className="text-gray-400">Fetching...</span>
        ) : (
          `${balance} ${symbol}`
        )}
      </div>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-white"
      />

      <div className="flex gap-2">
        <button
          onClick={handleMint}
          disabled={loading || !amount}
          className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          Mint
        </button>
        <button
          onClick={handleBurn}
          disabled={loading || !amount}
          className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 disabled:opacity-50"
        >
          Burn
        </button>
      </div>
    </div>
  )
}
