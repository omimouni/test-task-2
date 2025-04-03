<script lang="ts">
  import { CommuteTime } from '~ui/widgets'

  const onLoad = () =>
    chrome.runtime.sendMessage({
      type: 'GET_COMMUTE_TIME',
    })
</script>

<CommuteTime {onLoad} />
