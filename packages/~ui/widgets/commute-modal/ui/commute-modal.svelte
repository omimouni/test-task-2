<script lang="ts">
  import { onMount } from 'svelte'
  import { Button, Input } from '~ui/components'
  import { commuteStore, type Maxtime } from '~ui/stores'

  const STORAGE_KEY = 'commuteAddresses'
  const STORAGE_KEY_MAXTIME = 'commuteMaxtime'
  const MAX_ADDRESSES = 2

  let activeTab: 'addresses' | 'maxtime' = 'addresses'

  let newAddress = ''
  let editingAddress: string | null = null
  let editValue = ''
  let maxtime = $commuteStore.maxtime


  onMount(() => {
    const savedAddresses = localStorage.getItem(STORAGE_KEY)
    if (savedAddresses) {
      try {
        const addresses = JSON.parse(savedAddresses)
        commuteStore.setAddresses(addresses)
      } catch (error) {
        console.error('Failed to parse saved addresses:', error)
      }
    }

    const savedMaxtime = localStorage.getItem(STORAGE_KEY_MAXTIME)
    if (savedMaxtime) {
      try {
        const maxtimeTmp = JSON.parse(savedMaxtime)
        commuteStore.setMaxtime(maxtimeTmp)
        maxtime = maxtimeTmp
      } catch (error) {
        console.error('Failed to parse saved maxtime:', error)
      }
    }
  })

  const saveToLocalStorage = (addresses: string[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses))
  }

  const addAddress = () => {
    const trimmedAddress = newAddress.trim()
    if (!trimmedAddress || $commuteStore.addresses.length >= MAX_ADDRESSES)
      return

    commuteStore.addAddress(trimmedAddress)
    newAddress = ''
    saveToLocalStorage($commuteStore.addresses)
  }

  const handleEdit = (address: string) => {
    editingAddress = address
    editValue = address
  }

  const saveEdit = () => {
    if (!editingAddress || !editValue.trim()) return

    const addresses = $commuteStore.addresses.map(addr =>
      addr === editingAddress ? editValue.trim() : addr,
    )
    $commuteStore.addresses = addresses
    editingAddress = null
    saveToLocalStorage(addresses)
  }

  const cancelEdit = () => {
    editingAddress = null
    editValue = ''
  }

  const handleDelete = (address: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      commuteStore.removeAddress(address)
      saveToLocalStorage($commuteStore.addresses)
    }
  }


  const saveMaxtimeToLocalStorage = (maxtime: Maxtime) => {
    localStorage.setItem(STORAGE_KEY_MAXTIME, JSON.stringify(maxtime))
  }

  const saveMaxtime = () => {
    commuteStore.setMaxtime({
      ...maxtime,
    })
    saveMaxtimeToLocalStorage(maxtime)
  }

  const resetMaxtime = (type: keyof Maxtime | string) => {
    const newMaxtime = { ...maxtime }
    newMaxtime[type as keyof Maxtime] = null
    commuteStore.setMaxtime(newMaxtime)
    maxtime = newMaxtime
    saveMaxtimeToLocalStorage(maxtime)
  }
</script>

{#if $commuteStore.isOpen}
  <div
    class=".fixed uprent uprent-reset .inset-0 .z-[9999] .flex .h-screen .w-screen .items-center .justify-center .bg-black/50 .backdrop-blur-sm"
  >
    <button
      class=".absolute .h-screen .w-screen .bg-transparent"
      on:click={() => commuteStore.toggleOpen()}
      aria-label="Close"
    >
    </button>
    <div class=".z-[10] .w-[500px] .bg-white .p-4 .duration-300">
      <div>
        <div class=".flex .items-center .justify-between">
          <h1>Commute Modal</h1>
          <Button onClick={() => commuteStore.toggleOpen()}>X</Button>
        </div>

        <div>
          <ul class=".flex .items-center .gap-4">
            <li>
              <button
                class=".border-b-2 .border-transparent .p-2 .text-gray-500 {activeTab ===
                'addresses'
                  ? '!.border-primary .text-primary'
                  : ''}"
                on:click={() => (activeTab = 'addresses')}>Addresses</button
              >
            </li>
            <li>
              <button
                class=".border-b-2 .border-transparent .p-2 .text-gray-500 {activeTab ===
                'maxtime'
                  ? '!.border-primary .text-primary'
                  : ''}"
                on:click={() => (activeTab = 'maxtime')}>Max Time</button
              >
            </li>
          </ul>
        </div>

        <div class=".mt-4">
          {#if activeTab === 'addresses'}
            <div>
              {#each $commuteStore.addresses as address}
                <div
                  class=".flex .items-center .justify-between .border-b .border-gray-100 .p-3"
                >
                  {#if editingAddress === address}
                    <div class=".flex .flex-1 .items-center .gap-2">
                      <Input bind:value={editValue} />
                      <Button onClick={saveEdit}>Save</Button>
                      <Button onClick={cancelEdit}>Cancel</Button>
                    </div>
                  {:else}
                    <div class=".text-gray-700">{address}</div>
                    <div class=".flex .gap-2">
                      <Button onClick={() => handleEdit(address)}>Edit</Button>
                      <Button onClick={() => handleDelete(address)}
                        >Delete</Button
                      >
                    </div>
                  {/if}
                </div>
              {/each}

              {#if $commuteStore.addresses.length < MAX_ADDRESSES}
                <div class=".mt-4 .flex .flex-col .gap-4">
                  <Input bind:value={newAddress} />
                  <Button onClick={addAddress}>Add Address</Button>
                </div>
              {:else}
                <p class=".mt-4 .text-gray-500">
                  Maximum of {MAX_ADDRESSES} addresses reached
                </p>
              {/if}
            </div>
          {:else if activeTab === 'maxtime'}
            <div class=".flex .flex-col .gap-4">
              {#each Object.entries($commuteStore.maxtime) as [mode, value]}
                <div class=".flex .items-center .gap-4 .p-3 .border .border-gray-100 .rounded">
                  <span class=".w-24 .text-gray-700">{mode[0].toUpperCase() + mode.slice(1)}</span>
                  <input
                    class=".flex-1 .px-3 .py-2 .border .border-gray-300 .rounded .focus:outline-none .focus:ring-2 .focus:ring-primary .focus:border-transparent"
                    type="number"
                    bind:value={maxtime[mode]}
                    on:input={() => saveMaxtime()}
                  />
                  {#if value}
                    <Button
                      class=".p-2 .text-gray-500 .hover:text-gray-700 .transition-colors"
                      onClick={() => resetMaxtime(mode)}
                    >
                      X
                    </Button>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
