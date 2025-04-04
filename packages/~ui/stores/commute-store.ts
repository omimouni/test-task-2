/// <reference types="chrome"/>

import { writable } from 'svelte/store'
import { get } from 'svelte/store'

// Local storage keys for persisting data
const STORAGE_KEY = 'commuteAddresses'
const STORAGE_KEY_MAXTIME = 'commuteMaxtime'

/**
 * Represents maximum commute times for different transportation modes
 */
export type Maxtime = {
  driving: number | null
  transit: number | null
  biking: null | null
  walking: number | null
}

/**
 * Main store state interface
 */
export type CommuteStore = {
  isLoading: boolean
  isOpen: boolean
  addresses: string[]
  maxtime: Maxtime
  isExtension: boolean
}

// Initial state for the store
const initialState: CommuteStore = {
  isLoading: true,
  isExtension: false,
  isOpen: false,
  addresses: [],
  maxtime: {
    driving: null,
    transit: null,
    biking: null,
    walking: null,
  },
}

/**
 * Creates and manages a Svelte store for commute-related state
 * Handles addresses, maximum commute times, and UI state
 */
const createCommuteStore = () => {
  const commuteStore = writable<CommuteStore>(initialState)
  const { subscribe, update } = commuteStore

  // UI state management
  const setOpen = (isOpen: boolean) => update(state => ({ ...state, isOpen }))
  const toggleOpen = () => update(state => ({ ...state, isOpen: !state.isOpen }))
  const setLoading = (isLoading: boolean) => update(state => ({ ...state, isLoading }))

  // Address management functions
  const addAddress = (address: string) => {
    update(state => ({ ...state, addresses: [...state.addresses, address] }))
  }

  const removeAddress = (address: string) =>
    update(state => ({
      ...state,
      addresses: state.addresses.filter(a => a !== address),
    }))

  const editAddress = (oldAddress: string, newAddress: string) =>
    update(state => ({
      ...state,
      addresses: state.addresses.map(a => (a === oldAddress ? newAddress : a)),
    }))

  const setAddresses = (addresses: string[]) =>
    update(state => ({ ...state, addresses }))

  // Maximum time management
  const setMaxtime = (maxtime: Maxtime) =>
    update(state => ({ ...state, maxtime }))

  // Local storage persistence
  const saveAddressesToLocalStorage = async (addresses: string[]) => {
    const isExtension = get(commuteStore).isExtension;
    if (isExtension) {
      await chrome.runtime.sendMessage({ 
        type: 'SET_COOKIE', 
        name: STORAGE_KEY, 
        value: JSON.stringify(addresses), 
        url: 'http://localhost:5000', 
        domain: 'localhost', 
        path: '/', 
        expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).getTime() 
      })
    } else {
      document.cookie = `${STORAGE_KEY}=${JSON.stringify(addresses)}; path=/; domain=localhost; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toUTCString()}`
    }
  }

  const saveMaxtimeToLocalStorage = async (maxtime: Maxtime) => {
    const isExtension = get(commuteStore).isExtension;
    if (isExtension) {
      await chrome.runtime.sendMessage({ 
        type: 'SET_COOKIE', 
        name: STORAGE_KEY_MAXTIME, 
        value: JSON.stringify(maxtime), 
        url: 'http://localhost:5000', 
        domain: 'localhost', 
        path: '/', 
        expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).getTime() 
      })
    } else {
      document.cookie = `${STORAGE_KEY_MAXTIME}=${JSON.stringify(maxtime)}; path=/; domain=localhost; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toUTCString()}`
    }
  }

  /**
   * Initializes the store by loading saved data from localStorage
   * Sets loading state while data is being retrieved
   */
  const init = async () => {
    update(state => ({ ...state, isLoading: true }))

    // Check if the code is running in an extension
    if (chrome && typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined' && typeof chrome.runtime.id !== 'undefined') {
      const isExtension = chrome.runtime.id !== undefined
      if (isExtension) {
        update(state => ({ ...state, isExtension }))
      }
    }

    let addresses: string[] = []
    let maxtime: Maxtime = {
      driving: null,
      transit: null,
      biking: null,
      walking: null,
    }

    const isExtension = get(commuteStore).isExtension;

    if (isExtension) {
      // Get addresses from extension cookie
      const addressesCookie = await chrome.runtime.sendMessage({ 
        type: 'GET_COOKIE', 
        name: STORAGE_KEY, 
        url: 'http://localhost:5000' 
      });
      addresses = addressesCookie?.data ? JSON.parse(addressesCookie.data) : [];

      // Get maxtime from extension cookie
      const maxtimeCookie = await chrome.runtime.sendMessage({ 
        type: 'GET_COOKIE', 
        name: STORAGE_KEY_MAXTIME, 
        url: 'http://localhost:5000' 
      });
      const maxtimeCookieObject = maxtimeCookie?.data ? JSON.parse(maxtimeCookie.data) : null;
      if (maxtimeCookieObject) {
        maxtime = maxtimeCookieObject;
      }
    } else {
      // Get addresses from browser cookie
      const addressesCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith(STORAGE_KEY))
        ?.split('=')[1];
      addresses = addressesCookie ? JSON.parse(decodeURIComponent(addressesCookie)) : [];

      // Get maxtime from browser cookie  
      const maxtimeCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith(STORAGE_KEY_MAXTIME))
        ?.split('=')[1];
      const maxtimeCookieObject = maxtimeCookie ? JSON.parse(decodeURIComponent(maxtimeCookie)) : null;
      if (maxtimeCookieObject) {
        maxtime = maxtimeCookieObject;
      }
    }

    // Update store state
    update(state => ({
      ...state,
      addresses,
      maxtime,
      isLoading: false
    }));
  }

  // Return public store interface
  return {
    subscribe,
    setOpen,
    toggleOpen,
    setLoading,
    addAddress,
    removeAddress,
    editAddress,
    setAddresses,
    setMaxtime,
    init,
    saveAddressesToLocalStorage,
    saveMaxtimeToLocalStorage,
  }
}

// Create and export a singleton instance of the store
export default createCommuteStore()
