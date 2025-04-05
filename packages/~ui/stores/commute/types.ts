/// <reference types="chrome"/>

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
  isExtension: boolean
}

/**
 * UI action types for type safety
 */
export type UIActions = {
  setOpen: (isOpen: boolean) => void
  toggleOpen: () => void
  setLoading: (isLoading: boolean) => void
}

/**
 * Address management action types
 */
export type AddressActions = {
  addAddress: (address: string) => void
  removeAddress: (address: string) => void
  editAddress: (oldAddress: string, newAddress: string) => void
  setAddresses: (addresses: string[]) => void
}

/**
 * Time management action types
 */
export type TimeActions = {
  setMaxtime: (maxtime: Maxtime) => void
}

/**
 * Storage action types
 */
export type StorageActions = {
  saveAddressesToLocalStorage: (addresses: string[]) => Promise<void>
  saveMaxtimeToLocalStorage: (maxtime: Maxtime) => Promise<void>
}

/**
 * Complete store actions type
 */
export type CommuteStoreActions = UIActions &
  AddressActions &
  TimeActions &
  StorageActions & {
    init: () => Promise<void>
  }
