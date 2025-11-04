'use client'

import { useEffect, useState } from 'react'
import { APP_CONFIG } from './app-config'

export interface ParentMessage {
  type: 'AUTH_TOKEN' | 'USER_DATA' | 'CREDIT_UPDATE' | 'REQUEST_PAYMENT'
  payload: any
}

export interface ChildMessage {
  type: 'READY' | 'REQUEST_AUTH' | 'CREDIT_CHECK' | 'CREDIT_DEDUCT' | 'NAVIGATE'
  payload: any
}

class MessageBridge {
  private listeners: Map<string, Function[]> = new Map()
  private isInitialized = false

  initialize() {
    if (this.isInitialized || typeof window === 'undefined') return
    
    window.addEventListener('message', this.handleMessage.bind(this))
    this.isInitialized = true
    
    // Notify parent that we're ready
    this.sendToParent({ type: 'READY', payload: { app: 'legalease' } })
  }

  private handleMessage(event: MessageEvent) {
    // Verify origin in production
    if (process.env.NODE_ENV === 'production' && 
        event.origin !== APP_CONFIG.parentUrl) {
      console.warn('Rejected message from unauthorized origin:', event.origin)
      return
    }

    const message: ParentMessage = event.data
    
    const handlers = this.listeners.get(message.type) || []
    handlers.forEach(handler => handler(message.payload))
  }

  sendToParent(message: ChildMessage) {
    if (typeof window === 'undefined' || window.self === window.top) return
    
    window.parent.postMessage(message, APP_CONFIG.parentUrl)
  }

  on(messageType: string, handler: Function) {
    const handlers = this.listeners.get(messageType) || []
    handlers.push(handler)
    this.listeners.set(messageType, handlers)
  }

  off(messageType: string, handler: Function) {
    const handlers = this.listeners.get(messageType) || []
    const filtered = handlers.filter(h => h !== handler)
    this.listeners.set(messageType, filtered)
  }

  destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('message', this.handleMessage.bind(this))
    }
    this.listeners.clear()
    this.isInitialized = false
  }
}

export const messageBridge = new MessageBridge()

/**
 * Hook for embedded mode authentication
 */
export function useEmbeddedAuth() {
  const [userId, setUserId] = useState<string | null>(null)
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    messageBridge.initialize()

    // Request auth from parent
    messageBridge.sendToParent({ 
      type: 'REQUEST_AUTH', 
      payload: {} 
    })

    // Listen for auth data
    const handleAuth = (payload: any) => {
      setUserId(payload.userId)
      setSessionToken(payload.sessionToken)
      setIsReady(true)
    }

    messageBridge.on('AUTH_TOKEN', handleAuth)

    return () => {
      messageBridge.off('AUTH_TOKEN', handleAuth)
    }
  }, [])

  return { userId, sessionToken, isReady }
}

/**
 * Hook for embedded mode credit system
 */
export function useEmbeddedCredits(userId: string | null) {
  const [credits, setCredits] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  const checkCredits = async () => {
    if (!userId) return

    setLoading(true)
    
    // Ask parent for credit balance
    messageBridge.sendToParent({
      type: 'CREDIT_CHECK',
      payload: { userId }
    })
  }

  const deductCredits = async (amount: number, description: string) => {
    if (!userId) return false

    return new Promise<boolean>((resolve) => {
      messageBridge.sendToParent({
        type: 'CREDIT_DEDUCT',
        payload: { userId, amount, description }
      })

      // Listen for response
      const handleUpdate = (payload: any) => {
        if (payload.success) {
          setCredits(payload.newBalance)
          resolve(true)
        } else {
          resolve(false)
        }
        messageBridge.off('CREDIT_UPDATE', handleUpdate)
      }

      messageBridge.on('CREDIT_UPDATE', handleUpdate)
    })
  }

  useEffect(() => {
    if (userId) {
      checkCredits()
    }

    // Listen for credit updates from parent
    const handleUpdate = (payload: any) => {
      setCredits(payload.balance)
      setLoading(false)
    }

    messageBridge.on('CREDIT_UPDATE', handleUpdate)

    return () => {
      messageBridge.off('CREDIT_UPDATE', handleUpdate)
    }
  }, [userId])

  return { credits, loading, checkCredits, deductCredits }
}

/**
 * Navigate in parent window
 */
export function navigateParent(path: string) {
  messageBridge.sendToParent({
    type: 'NAVIGATE',
    payload: { path }
  })
}
