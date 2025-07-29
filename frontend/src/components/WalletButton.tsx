'use client'
import { useFreighter } from '@/hooks/useFreighter'
import { Button } from '@/components/ui/button'
import { formatAddress } from '@/lib/utils'

export const WalletButton = () => {
  const { publicKey, isConnected, connect, disconnect, connecting, error } = useFreighter()

  if (isConnected && publicKey) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-sm">
          <div className="text-green-600 font-medium">Connected</div>
          <div className="text-gray-600">{formatAddress(publicKey)}</div>
        </div>
        <Button
          onClick={disconnect}
          variant="outline"
          size="sm"
        >
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <div>
      <Button
        onClick={connect}
        disabled={connecting}
      >
        {connecting ? 'Connecting...' : 'Connect Freighter'}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}
