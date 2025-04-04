<script lang="ts">
  import { CommuteModal, CommuteTime } from '~ui/widgets'
  import { commuteStore } from '~ui/stores'

  const onLoad = () =>
    chrome.runtime.sendMessage({
      type: 'GET_COMMUTE_TIME',
      addresses: $commuteStore.addresses,
    })
</script>

<CommuteTime {onLoad} />
<CommuteModal />
