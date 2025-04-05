import { writable } from 'svelte/store'
import type { CommuteStore, CommuteStoreActions, Maxtime } from './types'
import { initialState } from './constants'
import { saveAddressesToLocalStorage, saveMaxtimeToLocalStorage } from './storage'
import { createUIActions, createAddressActions, createTimeActions } from './actions'
import { detectEnvironment, loadStoredData } from './utils'

/**
 * Creates a Svelte store to manage commute-related state.
 * This includes addresses, maximum commute times, and UI state management.
 * The store supports both browser and Chrome extension environments.
 */
const createCommuteStore = () => {
  const store = writable<CommuteStore>(initialState)
  
  // Create action groups
  const uiActions = createUIActions(store)
  const addressActions = createAddressActions(store)
  const timeActions = createTimeActions(store)

  /**
   * Initializes the store by loading saved data and setting up the environment
   */
  const init = async () => {
    store.update(state => ({ ...state, isLoading: true }))
    
    const isExtension = detectEnvironment(store)
    const { addresses, maxtime } = await loadStoredData(isExtension)

    store.update(state => ({
      ...state,
      addresses,
      maxtime,
      isLoading: false
    }))
  }

  // Combine all actions into public interface
  const actions: CommuteStoreActions = {
    ...uiActions,
    ...addressActions,
    ...timeActions,
    init,
    saveAddressesToLocalStorage: (addresses: string[]) => 
      saveAddressesToLocalStorage(addresses, store),
    saveMaxtimeToLocalStorage: (maxtime: Maxtime) => 
      saveMaxtimeToLocalStorage(maxtime, store),
  }

  return {
    subscribe: store.subscribe,
    ...actions
  }
}

// Create and export singleton instance
export default createCommuteStore() 