<script lang="ts">
  import { onMount } from 'svelte'
  import { Button, Input } from '~ui/components'
  import { commuteStore, type Maxtime } from '~ui/stores'
  import { XSVG } from '~ui/assets'

  const MAX_ADDRESSES = 2

  let activeTab: 'addresses' | 'maxtime' = 'addresses'

  let newAddress = ''
  let editingAddress: string | null = null
  let editValue = ''
  let maxtime = {
    driving: null,
    transit: null,
    biking: null,
    walking: null,
  }

  onMount(async () => {
    await commuteStore.init()
    maxtime = $commuteStore.maxtime
  })

  const saveToLocalStorage = (addresses: string[]) => {
    commuteStore.saveAddressesToLocalStorage(addresses)
  }

  const saveMaxtimeToLocalStorage = (maxtime: Maxtime) => {
    commuteStore.saveMaxtimeToLocalStorage(maxtime)
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
    // $commuteStore.addresses = addresses
    commuteStore.setAddresses(addresses)
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
    class="uprent uprent-reset .fixed .inset-0 .z-[9999] .flex .h-screen .w-screen .items-center .justify-center .bg-black/50 .backdrop-blur-sm"
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
                <div
                  class=".flex .items-center .gap-4 .rounded .border .border-gray-100 .p-3"
                >
                  <span class=".w-24 .text-gray-700"
                    >{mode[0].toUpperCase() + mode.slice(1)}</span
                  >
                  <input
                    class=".focus:outline-none .focus:ring-2 .focus:ring-primary .focus:border-transparent .flex-1 .rounded .border .border-gray-300 .px-3 .py-2"
                    type="number"
                    bind:value={maxtime[mode]}
                    on:input={() => saveMaxtime()}
                  />
                  {#if value}
                    <Button
                      class=".hover:text-gray-700 .p-2 .text-gray-500 .transition-colors"
                      onClick={() => resetMaxtime(mode)}
                    >
                      <XSVG class=".w-4 .h-4" />
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
