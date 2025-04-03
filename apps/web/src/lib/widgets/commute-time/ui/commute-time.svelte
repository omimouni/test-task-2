<script lang="ts">
  import api from '~api'
  import { CommuteTime } from '~ui/widgets'

  const onLoad = () => api.commute.durations.get()
</script>

<CommuteTime {onLoad} />
