'use client'
import { useState, useEffect, useCallback } from 'react'
import { requestAccess, setAllowed } from '@stellar/freighter-api'

interface FreighterState {
  publicKey: string | null
  isConnected: boolean
  connecting: boolean
  error: string | null
}

export const useFreighter = () => {
  const [state, setState] = useState<FreighterState>({
    publicKey: null,
    isConnected: false,
    connecting: false,
    error: null,
  })

  useEffect(() => {
    checkExistingConnection()
  }, [])

  const checkExistingConnection = async () => {
    try {
      const isAllowed = await setAllowed()
      if (isAllowed) {
        const publicKey = await requestAccess()
        setState((prev) => ({
          ...prev,
          publicKey: publicKey.address,
          isConnected: true,
          error: null,
        }))
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        publicKey: null,
        isConnected: false,
        error: null,
      }))
    }
  }

  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, connecting: true, error: null }))

    try {
      const publicKey = await requestAccess()
      setState((prev) => ({
        ...prev,
        publicKey: publicKey.address,
        isConnected: true,
        connecting: false,
        error: null,
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet'
      setState((prev) => ({
        ...prev,
        publicKey: null,
        isConnected: false,
        connecting: false,
        error: errorMessage,
      }))
    }
  }, [])

  const disconnect = useCallback(() => {
    setState({
      publicKey: null,
      isConnected: false,
      connecting: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    connect,
    disconnect,
    checkConnection: checkExistingConnection,
  }
}
