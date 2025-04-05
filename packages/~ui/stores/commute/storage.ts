import type { Maxtime } from './types'
import { STORAGE_KEY, STORAGE_KEY_MAXTIME, URL, DOMAIN } from './constants'
import { get } from 'svelte/store'
import type { Writable } from 'svelte/store'
import type { CommuteStore } from './types'

export const saveAddressesToLocalStorage = async (
  addresses: string[],
  commuteStore: Writable<CommuteStore>
) => {
  const isExtension = get(commuteStore).isExtension
  if (isExtension) {
    await chrome.runtime.sendMessage({
      type: 'SET_COOKIE',
      name: STORAGE_KEY,
      value: JSON.stringify(addresses),
      url: URL,
      domain: DOMAIN,
      path: '/',
      expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).getTime()
    })
  } else {
    document.cookie = `${STORAGE_KEY}=${JSON.stringify(addresses)}; path=/; domain=localhost; expires=${new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 30
    ).toUTCString()}`
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