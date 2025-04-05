import type { 
  UIActions, 
  AddressActions, 
  TimeActions, 
  Maxtime 
} from './types'
import { get } from 'svelte/store'
import type { Writable } from 'svelte/store'
import type { CommuteStore } from './types'

/**
 * Creates UI-related actions
 */
export const createUIActions = (store: Writable<CommuteStore>): UIActions => {
  const { update } = store
  
  return {
    setOpen: (isOpen: boolean) => 
      update(state => ({ ...state, isOpen })),
    
    toggleOpen: () => 
      update(state => ({ ...state, isOpen: !state.isOpen })),
    
    setLoading: (isLoading: boolean) => 
      update(state => ({ ...state, isLoading }))
  }
}

/**
 * Creates address management actions
 */
export const createAddressActions = (store: Writable<CommuteStore>): AddressActions => {
  const { update } = store
  
  return {
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
}

/**
 * Creates time management actions
 */
export const createTimeActions = (store: Writable<CommuteStore>): TimeActions => {
  const { update } = store
  
  return {
    setMaxtime: (maxtime: Maxtime) =>
      update(state => ({ ...state, maxtime }))
  }
} 