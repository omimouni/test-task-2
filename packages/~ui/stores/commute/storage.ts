import type { Maxtime, CommuteStore } from './types'
import { STORAGE_KEY, STORAGE_KEY_MAXTIME, URL, DOMAIN } from './constants'
import { get } from 'svelte/store'
import type { Writable } from 'svelte/store'

const THIRTY_DAYS_MS = 1000 * 60 * 60 * 24 * 30

const getExpirationDate = () => 
  new Date(Date.now() + THIRTY_DAYS_MS).toUTCString()

export const saveAddressesToLocalStorage = async (
  addresses: string[],
  commuteStore: Writable<CommuteStore>
): Promise<void> => {
  try {
    const isExtension = get(commuteStore).isExtension
    const serializedAddresses = JSON.stringify(addresses)

    if (isExtension) {
      await chrome.runtime.sendMessage({
        type: 'SET_COOKIE',
        name: STORAGE_KEY,
        value: serializedAddresses,
        url: URL,
        domain: DOMAIN,
        path: '/',
        expirationDate: Date.now() + THIRTY_DAYS_MS
      })
    } else {
      document.cookie = `${STORAGE_KEY}=${serializedAddresses}; path=/; domain=localhost; expires=${getExpirationDate()}`
    }
  } catch (error) {
    console.error('Failed to save addresses:', error)
    throw error
  }
}

export const saveMaxtimeToLocalStorage = async (
  maxtime: Maxtime,
  commuteStore: Writable<CommuteStore>
) => {
  const isExtension = get(commuteStore).isExtension
  if (isExtension) {
    await chrome.runtime.sendMessage({
      type: 'SET_COOKIE',
      name: STORAGE_KEY_MAXTIME,
      value: JSON.stringify(maxtime),
      url: URL,
      domain: DOMAIN,
      path: '/',
      expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).getTime()
    })
  } else {
    document.cookie = `${STORAGE_KEY_MAXTIME}=${JSON.stringify(
      maxtime
    )}; path=/; domain=localhost; expires=${new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 30
    ).toUTCString()}`
  }
} 