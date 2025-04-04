export type Durations = Array<{
  address: string
  durations: {
    walking: number | null
    driving: number | null
    transit: number | null
    biking: number | null
  }
}>
