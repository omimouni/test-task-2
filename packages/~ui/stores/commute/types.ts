/// <reference types="chrome"/>

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
  isExtension: boolean
} 