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

    if (error || data.status === 'error') return
    durations = data.payload.durations
  }
</script>

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
          {#each $commuteStore.addresses as address}
            <div class="">
              <span class=".text-ellipsis .text-xs .opacity-50">
                {address}
              </span>

              <div class=".mt-1 .flex .items-center .gap-5">
                <span>
                  <BikeSVG />
                  {durations.biking}
                </span>
                <span>
                  <CarSVG />
                  {durations.driving}
                </span>
                <span>
                  <BusSVG />
                  {durations.transit}
                </span>
                <span>
                  <WalkSVG />
                  {durations.walking}
                </span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>
