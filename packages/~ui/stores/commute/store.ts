import { writable } from 'svelte/store'
import type { CommuteStore, Maxtime } from './types'
import { initialState } from './constants'
import { saveAddressesToLocalStorage, saveMaxtimeToLocalStorage } from './storage'
import { get } from 'svelte/store'
import { STORAGE_KEY, STORAGE_KEY_MAXTIME } from './constants'

/**
 * Creates a Svelte store to manage commute-related state.
 * This includes addresses, maximum commute times, and UI state management.
 * The store supports both browser and Chrome extension environments.
 */
const createCommuteStore = () => {
  const commuteStore = writable<CommuteStore>(initialState)
  const { subscribe, update } = commuteStore

  /**
   * UI State Management
   * These functions handle the visibility and loading states of the UI
   */
  const uiActions = {
    setOpen: (isOpen: boolean) => 
      update(state => ({ ...state, isOpen })),
    
    toggleOpen: () => 
      update(state => ({ ...state, isOpen: !state.isOpen })),
    
    setLoading: (isLoading: boolean) => 
      update(state => ({ ...state, isLoading }))
  }

  /**
   * Address Management
   * Functions to handle CRUD operations for commute addresses
   */
  const addressActions = {
    addAddress: (address: string) => 
      update(state => ({ 
        ...state, 
        addresses: [...state.addresses, address] 
      })),

    removeAddress: (address: string) =>
      update(state => ({
        ...state,
        addresses: state.addresses.filter(a => a !== address),
      })),

    editAddress: (oldAddress: string, newAddress: string) =>
      update(state => ({
        ...state,
        addresses: state.addresses.map(a => 
          a === oldAddress ? newAddress : a
        ),
      })),

    setAddresses: (addresses: string[]) =>
      update(state => ({ ...state, addresses }))
  }

  /**
   * Maximum Time Management
   * Handles updates to maximum commute time settings
   */
  const timeActions = {
    setMaxtime: (maxtime: Maxtime) =>
      update(state => ({ ...state, maxtime }))
  }

  /**
   * Detects if the code is running in a Chrome extension environment
   * Updates the store's isExtension flag accordingly
   */
  const detectEnvironment = () => {
    const isExtensionEnv = 
      chrome && 
      typeof chrome !== 'undefined' && 
      typeof chrome.runtime !== 'undefined' && 
      typeof chrome.runtime.id !== 'undefined' &&
      chrome.runtime.id !== undefined

    if (isExtensionEnv) {
      update(state => ({ ...state, isExtension: true }))
    }
  }

  /**
   * Loads stored data from either extension storage or browser cookies
   * @returns {Promise<{addresses: string[], maxtime: Maxtime}>}
   */
  const loadStoredData = async (isExtension: boolean) => {
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

  /**
   * Initializes the store by loading saved data and setting up the environment
   */
  const init = async () => {
    update(state => ({ ...state, isLoading: true }))
    
    detectEnvironment()
    
    const isExtension = get(commuteStore).isExtension
    const { addresses, maxtime } = await loadStoredData(isExtension)

    update(state => ({
      ...state,
      addresses,
      maxtime,
      isLoading: false
    }))
  }

  // Return public store interface
  return {
    subscribe,
    ...uiActions,
    ...addressActions,
    ...timeActions,
    init,
    saveAddressesToLocalStorage: (addresses: string[]) => 
      saveAddressesToLocalStorage(addresses, commuteStore),
    saveMaxtimeToLocalStorage: (maxtime: Maxtime) => 
      saveMaxtimeToLocalStorage(maxtime, commuteStore),
  }
}

// Create and export a singleton instance of the store
export default createCommuteStore() 