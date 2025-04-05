import type { Writable } from 'svelte/store'
import type { CommuteStore, Maxtime } from './types'
import { STORAGE_KEY, STORAGE_KEY_MAXTIME } from './constants'
import { initialState } from './constants'

/**
 * Detects if the code is running in a Chrome extension environment
 */
export const detectEnvironment = (store: Writable<CommuteStore>): boolean => {
  const isExtensionEnv = typeof chrome !== 'undefined' 
    && chrome?.runtime?.id !== undefined;

  if (isExtensionEnv) {
    store.update(state => ({ ...state, isExtension: true }));
  }

  return isExtensionEnv;
}

/**
 * Loads stored data from either extension storage or browser cookies
 */
export const loadStoredData = async (isExtension: boolean) => {
  if (isExtension) {
    return await loadExtensionData()
  }
  return loadBrowserData()
}

/**
 * Loads data from Chrome extension storage
 */
const loadExtensionData = async () => {
  const [addressesCookie, maxtimeCookie] = await Promise.all([
    chrome.runtime.sendMessage({
      type: 'GET_COOKIE',
      name: STORAGE_KEY,
      url: 'http://localhost:5000'
    }),
    chrome.runtime.sendMessage({
      type: 'GET_COOKIE',
      name: STORAGE_KEY_MAXTIME,
      url: 'http://localhost:5000'
    })
  ])

  const addresses = addressesCookie?.data ? 
    JSON.parse(addressesCookie.data) : []
  
  const maxtime = maxtimeCookie?.data ? 
    JSON.parse(maxtimeCookie.data) : initialState.maxtime

  return { addresses, maxtime }
}

/**
 * Loads data from browser cookies
 */
const loadBrowserData = () => {
  const cookies = document.cookie.split('; ')
  
  const addressesCookie = cookies
    .find(row => row.startsWith(STORAGE_KEY))
    ?.split('=')[1]
  
  const maxtimeCookie = cookies
    .find(row => row.startsWith(STORAGE_KEY_MAXTIME))
    ?.split('=')[1]

  const addresses = addressesCookie ? 
    JSON.parse(decodeURIComponent(addressesCookie)) : []
  
  const maxtime = maxtimeCookie ? 
    JSON.parse(decodeURIComponent(maxtimeCookie)) : initialState.maxtime

  return { addresses, maxtime }
} 