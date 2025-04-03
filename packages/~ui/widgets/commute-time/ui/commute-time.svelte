<script lang="ts">
  import type { Durations } from '~core/database'
  import { Button } from '~ui/components'
  import { RouteSVG } from '~ui/assets'

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
    <Button primary {loading} onClick={load}>
      <RouteSVG slot="icon" />
      Load commutes
    </Button>
  {:else}
    {JSON.stringify(durations, null, 2)}
  {/if}
</div>
