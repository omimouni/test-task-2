import { writable } from 'svelte/store'

// Local storage keys for persisting data
const STORAGE_KEY = 'commuteAddresses'
const STORAGE_KEY_MAXTIME = 'commuteMaxtime'

/**
 * Represents maximum commute times for different transportation modes
 */
export type Maxtime = {
  driving: number | null
  transit: number | null
  biking: number | null
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
}

// Initial state for the store
const initialState: CommuteStore = {
  isLoading: true,
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
  const saveAddressesToLocalStorage = (addresses: string[]) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses))

  const saveMaxtimeToLocalStorage = (maxtime: Maxtime) =>
    localStorage.setItem(STORAGE_KEY_MAXTIME, JSON.stringify(maxtime))

  /**
   * Initializes the store by loading saved data from localStorage
   * Sets loading state while data is being retrieved
   */
  const init = () => {
    update(state => ({ ...state, isLoading: true }))

    // Load saved data from localStorage
    const addresses = localStorage.getItem(STORAGE_KEY)
    const maxtime = localStorage.getItem(STORAGE_KEY_MAXTIME)

    console.log('addresses', addresses)
    console.log('maxtime', maxtime)

    // Restore saved addresses if they exist
    if (addresses) {
      setAddresses(JSON.parse(addresses))
    }

    // Restore saved maximum times if they exist
    if (maxtime) {
      setMaxtime(JSON.parse(maxtime))
    }

    update(state => ({ ...state, isLoading: false }))
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
