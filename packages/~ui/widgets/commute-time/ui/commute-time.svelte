<script lang="ts">
  import type { Durations } from '~core/database'
  import { Button } from '~ui/components'
  import { commuteStore } from '~ui/stores'
  import {
    BikeSVG,
    CarSVG,
    WalkSVG,
    BusSVG,
    RouteSVG,
    SettingsSVG,
  } from '~ui/assets'

  export let onLoad: () => Promise<{
    data:
      | {
          status: 'success'
          payload: {
            durations: Durations
          }
        }
      | {
          status: 'error'
          message: string
        }
      | null
    error: any
  }>

  let loading = false
  let durations: Durations | null = null

  const load = async () => {
    loading = true
    const { data, error } = await onLoad()
    loading = false

    if (error || !data || data.status === 'error') return
    durations = data.payload.durations
  }

  // Helper function to ensure type safety and handle null cases
  const shouldHighlight = (mode: string, value: number | null): boolean => {
    const maxTime =
      $commuteStore.maxtime[mode as keyof typeof $commuteStore.maxtime]
    return maxTime !== null && value !== null && maxTime > value
  }
</script>

{#if $commuteStore.isLoading}
  <span class=".m-2 .h-fit .w-fit .rounded-full .bg-primary/50">
    <span
      class=".block .aspect-square .w-4 .animate-spin .rounded-full .border-2 .border-transparent .border-t-primary"
    ></span>
  </span>
{:else}
  <div class=".p-2">
    {#if !durations}
      <div class=".flex .items-center .gap-1">
        <Button
          primary
          {loading}
          onClick={load}
          disabled={$commuteStore.addresses.length === 0}
        >
          <RouteSVG slot="icon" />
          Load commutes
        </Button>
        <Button onClick={() => commuteStore.toggleOpen()}>
          <SettingsSVG />
        </Button>
      </div>
      {#if $commuteStore.addresses.length === 0}
        <p class=".mt-2 .text-right .text-xs .text-gray-500">
          No addresses added
        </p>
      {/if}
    {:else}
      <div class=".flex .w-fit .flex-col .gap-2">
        <div class=".rounded .bg-primary .p-2 .px-4 .text-white">
          <div class=".flex .flex-col .gap-2 .text-xs">
            {#each durations as duration}
              <div class="">
                <span
                  class=".block .text-ellipsis .text-center .text-xs .opacity-50"
                >
                  {duration.address}
                </span>

                <div class=".mt-1 .flex .items-center .gap-2">
                  {#each Object.entries(duration.durations) as [mode, value]}
                    <span
                      class="{shouldHighlight(mode, value)
                        ? '.bg-red-500'
                        : ''} .flex .items-center .gap-1 .rounded .p-1"
                    >
                      {#if mode === 'biking'}
                        <BikeSVG />
                      {:else if mode === 'driving'}
                        <CarSVG />
                      {:else if mode === 'transit'}
                        <BusSVG />
                      {:else if mode === 'walking'}
                        <WalkSVG />
                      {/if}
                      {value}
                    </span>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if}
