export const STORAGE_KEY = 'commuteAddresses'
export const STORAGE_KEY_MAXTIME = 'commuteMaxtime'

const env = import.meta.env
export const URL = env.VITE_API_URL
export const DOMAIN = env.VITE_API_DOMAIN

export const initialState = {
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