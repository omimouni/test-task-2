<script lang="ts">
  import type { Durations } from '~core/database'
  import { Button } from '~ui/components'
  import { RouteSVG } from '~ui/assets'
  import { commuteStore } from '~ui/stores'

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
    <div class=".flex .items-center .gap-1" >
      <Button primary {loading} onClick={load} disabled={$commuteStore.addresses.length === 0}>
        <RouteSVG slot="icon" />
        Load commutes
      </Button>
      <Button onClick={() => commuteStore.toggleOpen()}>C</Button>
    </div>
    {#if $commuteStore.addresses.length === 0}
      <p class=".text-gray-500 .text-right .mt-2 .text-xs">No addresses added</p>
    {/if}
  {:else}
    {JSON.stringify(durations, null, 2)}
  {/if}
</div>
