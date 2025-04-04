<script lang="ts">
  import { CommuteModal, CommuteTime } from '~ui/widgets'

  const onLoad = () =>
    chrome.runtime.sendMessage({
      type: 'GET_COMMUTE_TIME',
    })
</script>

<CommuteTime {onLoad} />
<CommuteModal />
