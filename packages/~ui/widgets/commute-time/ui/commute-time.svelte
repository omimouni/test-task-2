<script lang="ts">
  import type { Durations } from '~core/database'
  import { Button } from '~ui/components'
  import { RouteSVG } from '~ui/assets'
  import { commuteStore } from '../stores/commute-store'

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

<div>
  {#if !durations}
    <div class=".flex .gap-1 .p-2">
      <Button primary {loading} onClick={load}>
        <RouteSVG slot="icon" />
        Load commutes
      </Button>
      <Button onClick={() => commuteStore.toggle()}>C</Button>
    </div>
  {:else}
    {JSON.stringify(durations, null, 2)}
  {/if}
</div>
