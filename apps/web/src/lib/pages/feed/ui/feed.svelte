<script lang="ts">
  import { FeedProperties } from '.'
  import { feed } from '$lib/shared/stores'
  import { onMount } from 'svelte'
  import { CommuteModal } from '~ui/widgets'

  onMount(() => {
    feed.reload()
    // load commute config
  })
</script>

<div class=".flex .max-h-screen .flex-col .bg-gray-50">
  <CommuteModal />
  <FeedProperties />
</div>
