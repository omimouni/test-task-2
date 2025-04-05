<script lang="ts">
  import api from '~api'
  import { CommuteTime } from '~ui/widgets'
  import { commuteStore } from '~ui/stores'

  const onLoad = () =>
    api.commute.durations.post({
      addresses: $commuteStore.addresses,
    })
</script>

<CommuteTime {onLoad} />
