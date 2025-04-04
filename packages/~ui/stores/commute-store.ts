import { writable } from 'svelte/store'

export type Maxtime = {
  driving: number | null
  transit: number | null
  biking: number | null
  walking: number | null
}

export type CommuteStore = {
  isLoading: boolean
  isOpen: boolean
  addresses: string[]
  maxtime: Maxtime
}

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

  // TODO: make this dynamic
  const setMaxtime = (maxtime: Maxtime) =>
    update(state => ({ ...state, maxtime }))
  const setMaxtimeDriving = (driving: number | null) =>
    update(state => ({ ...state, maxtime: { ...state.maxtime, driving } }))
  const setMaxtimeTransit = (transit: number | null) =>
    update(state => ({ ...state, maxtime: { ...state.maxtime, transit } }))
  const setMaxtimeBiking = (biking: number | null) =>
    update(state => ({ ...state, maxtime: { ...state.maxtime, biking } }))
  const setMaxtimeWalking = (walking: number | null) =>
    update(state => ({ ...state, maxtime: { ...state.maxtime, walking } }))

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
    setMaxtimeDriving,
    setMaxtimeTransit,
    setMaxtimeBiking,
    setMaxtimeWalking,
  }
}

export default createCommuteStore()
