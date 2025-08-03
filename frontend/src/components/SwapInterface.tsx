'use client'

import { useState } from 'react'
import { RefreshCw, TrendingUp, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'

const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const tokens = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: '⟠',
    color: 'from-blue-400 to-blue-600',
    balance: '2.5431',
    address: '0x0000000000000000000000000000000000000000',
    price: '$2,456.78',
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    icon: '₿',
    color: 'from-orange-400 to-orange-600',
    balance: '0.1234',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    price: '$43,210.50',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '◉',
    color: 'from-blue-500 to-blue-700',
    balance: '1,250.00',
    address: '0xA0b86a33E6441b8435b662303c0f218C8c7c8e8e',
    price: '$1.00',
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    icon: '₮',
    color: 'from-green-400 to-green-600',
    balance: '890.50',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    price: '$0.999',
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    icon: '◎',
    color: 'from-purple-400 to-purple-600',
    balance: '45.67',
    address: '0xD31a59c85aE9D8edEFeC411D448f90841571b89c',
    price: '$98.45',
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    icon: '⬟',
    color: 'from-purple-500 to-purple-700',
    balance: '1,890.23',
    address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    price: '$0.87',
  },
]

export default function SwapInterface() {
  const [fromToken, setFromToken] = useState('ETH')
  const [toToken, setToToken] = useState('USDC')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')

  const handleSwapTokens = () => {
    const tempToken = fromToken
    const tempAmount = fromAmount
    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  const getTokenData = (symbol: string) => {
    return tokens.find((token) => token.symbol === symbol) || tokens[0]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gray-800/60 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-700/50 shadow-lg mb-4">
            <Zap className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold text-white">Lightning Swap</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Token Exchange
          </h1>
          <p className="text-gray-300">Trade tokens instantly with the best rates</p>
        </div>

        <Card className="bg-gray-800/40 backdrop-blur-xl border-gray-700/30 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-5 gap-6 items-center">
              <div className="lg:col-span-2">
                <div className="text-center mb-4">
                  <span className="text-sm font-medium text-gray-300 bg-gray-700/50 rounded-full px-3 py-1">
                    You Pay
                  </span>
                </div>

                <div
                  className={`bg-gradient-to-br ${
                    getTokenData(fromToken).color
                  } p-6 rounded-2xl shadow-lg`}
                >
                  <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Select
                        value={fromToken}
                        onValueChange={setFromToken}
                      >
                        <SelectTrigger className="w-auto bg-transparent border-none shadow-none p-0 h-auto">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getTokenData(fromToken).icon}</span>
                            <div className="text-left">
                              <div className="font-bold text-white">{fromToken}</div>
                              <div className="text-xs text-gray-300">
                                {getTokenData(fromToken).name}
                              </div>
                            </div>
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800/95 backdrop-blur-sm border-gray-700/30">
                          {tokens.map((token) => (
                            <SelectItem
                              key={token.symbol}
                              value={token.symbol}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{token.icon}</span>
                                <div>
                                  <div className="font-medium">{token.symbol}</div>
                                  <div className="text-xs text-gray-400">{token.name}</div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">Balance</div>
                        <div className="font-semibold text-white">
                          {getTokenData(fromToken).balance}
                        </div>
                      </div>
                    </div>

                    <Input
                      type="number"
                      placeholder="0.00"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      className="text-2xl font-bold text-center border-none bg-transparent shadow-none focus-visible:ring-0 p-0 h-auto"
                    />

                    <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                      <span>{getTokenData(fromToken).price}</span>
                      <span>{truncateAddress(getTokenData(fromToken).address)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1 flex justify-center">
                <Button
                  onClick={handleSwapTokens}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 border-4 border-gray-700"
                >
                  <RefreshCw className="w-6 h-6 text-white" />
                </Button>
              </div>

              <div className="lg:col-span-2">
                <div className="text-center mb-4">
                  <span className="text-sm font-medium text-gray-300 bg-gray-700/50 rounded-full px-3 py-1">
                    You Receive
                  </span>
                </div>

                <div
                  className={`bg-gradient-to-br ${
                    getTokenData(toToken).color
                  } p-6 rounded-2xl shadow-lg`}
                >
                  <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Select
                        value={toToken}
                        onValueChange={setToToken}
                      >
                        <SelectTrigger className="w-auto bg-transparent border-none shadow-none p-0 h-auto">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getTokenData(toToken).icon}</span>
                            <div className="text-left">
                              <div className="font-bold text-white">{toToken}</div>
                              <div className="text-xs text-gray-300">
                                {getTokenData(toToken).name}
                              </div>
                            </div>
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800/95 backdrop-blur-sm border-gray-700/30">
                          {tokens.map((token) => (
                            <SelectItem
                              key={token.symbol}
                              value={token.symbol}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{token.icon}</span>
                                <div>
                                  <div className="font-medium">{token.symbol}</div>
                                  <div className="text-xs text-gray-400">{token.name}</div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">Balance</div>
                        <div className="font-semibold text-white">
                          {getTokenData(toToken).balance}
                        </div>
                      </div>
                    </div>

                    <Input
                      type="number"
                      placeholder="0.00"
                      value={toAmount}
                      onChange={(e) => setToAmount(e.target.value)}
                      className="text-2xl font-bold text-center border-none bg-transparent shadow-none focus-visible:ring-0 p-0 h-auto"
                    />

                    <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                      <span>{getTokenData(toToken).price}</span>
                      <span>{truncateAddress(getTokenData(toToken).address)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-xs text-gray-400">Exchange Rate</div>
                    <div className="font-semibold">
                      1 {fromToken} = 1,234.56 {toToken}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Network Fee</div>
                  <div className="font-semibold text-orange-600">~$2.50</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Price Impact</div>
                  <div className="font-semibold text-green-600">{'<0.01%'}</div>
                </div>
              </div>
            </div>

            <Button
              className="w-full h-14 mt-6 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={!fromAmount || !toAmount}
            >
              {!fromAmount || !toAmount
                ? 'Enter Amount to Swap'
                : `Swap ${fromToken} for ${toToken}`}
            </Button>
          </CardContent>
        </Card>

        <div className="mt-8 grid md:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/30">
            <div className="text-2xl font-bold text-indigo-600">$2.4B+</div>
            <div className="text-sm text-gray-300">Total Volume</div>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/30">
            <div className="text-2xl font-bold text-cyan-600">150K+</div>
            <div className="text-sm text-gray-300">Active Users</div>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/30">
            <div className="text-2xl font-bold text-green-600">99.9%</div>
            <div className="text-sm text-gray-300">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  )
}
