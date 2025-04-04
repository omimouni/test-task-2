import { writable } from 'svelte/store'

export type CommuteStore = {
  isLoading: boolean
  isOpen: boolean
  addresses: string[]
}

const initialState: CommuteStore = {
  isLoading: true,
  isOpen: false,
  addresses: [],
}

/**
 * Creates a store to manage commute-related state
 */
const createCommuteStore = () => {
  const commuteStore = writable<CommuteStore>(initialState)
  const { subscribe, update } = commuteStore

  const setOpen = (isOpen: boolean) => update(state => ({ ...state, isOpen }))
  const toggleOpen = () =>
    update(state => ({ ...state, isOpen: !state.isOpen }))
  const setLoading = (isLoading: boolean) =>
    update(state => ({ ...state, isLoading }))

  const addAddress = (address: string) =>
    update(state => ({ ...state, addresses: [...state.addresses, address] }))
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

  return {
    subscribe,
    setOpen,
    toggleOpen,
    setLoading,
    addAddress,
    removeAddress,
    editAddress,
    setAddresses,
  }
}

export default createCommuteStore()
