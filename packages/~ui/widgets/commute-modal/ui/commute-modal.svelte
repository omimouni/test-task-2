<script lang="ts">
  import { Button } from '~ui/components'
  import { onMount } from 'svelte'

  export let is_extension: boolean = false

  let open = false
  let address = ''
  let tmpAddress = ''

  const setCookie = async (name: string, value: string) => {

    console.log('setCookie', name, value, 'is_extension', is_extension);
    if (!is_extension) {
      document.cookie = `${name}=${value}; path=/; domain=localhost; expires=Fri, 31 Dec 9999 23:59:59 GMT`

      return true;
    }

    const cookie: boolean = await new Promise<boolean>((resolve, reject) => {
      chrome.runtime.sendMessage({ type: 'SET_COOKIE', name, value }, (response) => {
        resolve(response.success)
      })
    });

    return cookie;
  }

  const getCookie = async (name: string) : Promise<string> => {
    console.log('getCookie', name, 'is_extension', is_extension);
    if (!is_extension) {
      return (
        document.cookie
          .split('; ')
          .find(row => row.startsWith(`${name}=`))
          ?.split('=')[1] || ''
      )
    }

    const cookie: string = await new Promise<string>((resolve, reject) => {
      chrome.runtime.sendMessage({ type: 'GET_COOKIE', name }, (response) => {
        resolve(response.value)
      })
    });

    return cookie;
  }

  onMount(async () => {
    // get address from local storage
    console.log('onMount', 'is_extension', is_extension);
    address = await getCookie('commute-address')
    tmpAddress = address
  })

  const onSave = async () => {
    address = tmpAddress

    // save to local storage
    await setCookie('commute-address', address)

    console.log('address', address)
  }
</script>

<div
  class="uprent-reset .fixed .left-0 .top-0 .z-[9999] .flex .h-screen .w-screen .items-center .justify-center .bg-black/50"
>
  <div class=".rounded-lg .bg-white .p-4">
    <h1>Commute Time</h1>

    <div>
      <input
        type="text"
        placeholder="Enter your address"
        class=""
        bind:value={tmpAddress}
      />
      <Button class=".w-full" onClick={onSave}>Save</Button>
      {address}
    </div>
  </div>
</div>
