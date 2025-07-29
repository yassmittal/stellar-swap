'use client'
import { useFreighter } from '@/hooks/useFreighter'
import { useEffect, useState, useCallback } from 'react'
import { getAccountBalance } from '@/utils/stellar'

export const AccountInfo = () => {
  const { publicKey, isConnected } = useFreighter()
  const [balance, setBalance] = useState<string>('0')
  const [loading, setLoading] = useState(false)

  const loadBalance = useCallback(async () => {
    if (!publicKey) return

    setLoading(true)
    try {
      const accountBalance = await getAccountBalance(publicKey)
      setBalance(accountBalance)
    } catch (error) {
      console.error('Failed to load balance:', error)
    } finally {
      setLoading(false)
    }
  }, [publicKey])

  useEffect(() => {
    if (isConnected && publicKey) {
      loadBalance()
    }
  }, [isConnected, publicKey, loadBalance])

  if (!isConnected || !publicKey) {
    return (
      <div className="text-center py-8 text-gray-500">
        Connect your wallet to view account information
      </div>
    )
  }

  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-lg font-semibold mb-4">Account Information</h2>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-600">Public Key</label>
          <div className="font-mono text-sm  p-2 rounded break-all">{publicKey}</div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">XLM Balance</label>
          <div className="text-2xl font-bold text-blue-600">
            {loading ? 'Loading...' : `${balance} XLM`}
          </div>
        </div>

        <button
          onClick={loadBalance}
          disabled={loading}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Refresh Balance
        </button>
      </div>
    </div>
  )
}
