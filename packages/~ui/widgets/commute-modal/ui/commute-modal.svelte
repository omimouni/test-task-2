<script lang="ts">
  import { onMount } from 'svelte'
  import { Button, Input } from '~ui/components'
  import { commuteStore, type Maxtime } from '~ui/stores'
  import { 
    XSVG,
    MapPinSVG,
    PencilSVG,
    TrashSVG,
    CheckSVG,
  } from '~ui/assets'

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
    editValue = ''
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
    class="uprent uprent-reset .fixed .inset-0 .z-[9999] .flex .h-screen .w-screen .items-center .justify-center .bg-black/60 .backdrop-blur-sm"
  >
    <button
      class=".absolute .h-screen .w-screen .bg-transparent"
      on:click={() => commuteStore.toggleOpen()}
      aria-label="Close"
    >
    </button>
    <div class=".z-[10] .w-[500px] .rounded-lg .bg-white .p-6 .shadow-xl .duration-300">
      <div>
        <div class=".mb-6 .flex .items-center .justify-between">
          <h1 class=".text-xl .font-semibold .text-gray-800">Commute Settings</h1>
          <Button 
            class=".rounded-full .p-2 .hover:bg-gray-100" 
            onClick={() => commuteStore.toggleOpen()}
          >
            <XSVG class=".h-5 .w-5" />
          </Button>
        </div>

        <div class=".mb-6">
          <ul class=".flex .items-center .gap-6 .border-b .border-gray-200">
            <li>
              <button
                class=".border-b-2 .border-transparent .px-4 .py-3 .text-gray-600 .font-medium {activeTab ===
                'addresses'
                  ? '!.border-primary .text-primary'
                  : ''}"
                on:click={() => (activeTab = 'addresses')}>Addresses</button
              >
            </li>
            <li>
              <button
                class=".border-b-2 .border-transparent .px-4 .py-3 .text-gray-600 .font-medium {activeTab ===
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
            <div class=".space-y-3">
              {#each $commuteStore.addresses as address}
                <div
                  class=".group .flex .items-center .justify-between .rounded-lg .border .border-gray-200 .p-4 .hover:bg-gray-50 .transition-colors"
                >
                  {#if editingAddress === address}
                    <div class=".flex .flex-1 .items-center .gap-3">
                      <div class=".relative .flex-1">
                        <div class=".absolute .left-3 .top-1/2 .-translate-y-1/2 .text-gray-400">
                          <MapPinSVG />
                        </div>
                        <Input 
                          bind:value={editValue}
                          placeholder="Enter address"
                        />
                      </div>
                      <Button 
                        class=".bg-primary .text-white .p-2 .rounded-full .hover:bg-primary-dark .transition-colors"
                        title="Save"
                        onClick={saveEdit}
                      >
                        <CheckSVG />
                      </Button>
                      <Button 
                        class=".text-gray-600 .p-2 .rounded-full .hover:bg-gray-100 .transition-colors"
                        title="Cancel"
                        onClick={cancelEdit}
                      >
                        <XSVG class=".h-5 .w-5" />
                      </Button>
                    </div>
                  {:else}
                    <div class=".flex .items-center .gap-3">
                      <div class=".text-gray-400">
                        <MapPinSVG />
                      </div>
                      <span class=".text-gray-700 .font-medium">{address}</span>
                    </div>
                    <div class=".flex .gap-2 .opacity-0 .group-hover:opacity-100 .transition-opacity">
                      <Button 
                        class=".p-2 .rounded-full .text-gray-600 .hover:bg-gray-100 .transition-colors"
                        title="Edit address"
                        onClick={() => handleEdit(address)}
                      >
                        <PencilSVG />
                      </Button>
                      <Button 
                        class=".p-2 .rounded-full .text-red-600 .hover:bg-red-50 .transition-colors"
                        title="Delete address"
                        onClick={() => handleDelete(address)}
                      >
                        <TrashSVG />
                      </Button>
                    </div>
                  {/if}
                </div>
              {/each}

              {#if $commuteStore.addresses.length < MAX_ADDRESSES}
                <div class=".mt-6 .space-y-4">
                  <div class=".relative">
                    <div class=".absolute .left-3 .top-1/2 .-translate-y-1/2 .text-gray-400">
                      <MapPinSVG />
                    </div>
                    <Input 
                      placeholder="Enter new address"
                      bind:value={newAddress}
                    />
                  </div>
                  <Button 
                    class=".w-full .bg-primary .text-white .py-3 .rounded-md .hover:bg-primary-dark .transition-colors .flex .items-center .justify-center .gap-2"
                    onClick={addAddress}
                  >
                    <MapPinSVG />
                    <span>Add Address</span>
                  </Button>
                </div>
              {:else}
                <div class=".mt-4 .flex .items-center .justify-center .gap-2 .text-gray-500 .text-sm .bg-gray-50 .rounded-lg .p-4">
                  <XSVG class=".h-5 .w-5" />
                  <p>Maximum of {MAX_ADDRESSES} addresses reached</p>
                </div>
              {/if}
            </div>
          {:else if activeTab === 'maxtime'}
            <div class=".space-y-4">
              {#each Object.entries($commuteStore.maxtime) as [mode, value]}
                <div
                  class=".flex .items-center .gap-4 .rounded-lg .border .border-gray-200 .p-4 .hover:bg-gray-50"
                >
                  <span class=".w-24 .text-gray-700 .font-medium"
                    >{mode[0].toUpperCase() + mode.slice(1)}</span
                  >
                  <Input
                    placeholder="Enter time in minutes"
                    bind:value={maxtime[mode]}
                    on:input={() => saveMaxtime()}
                  />
                  {#if value}
                    <Button
                      class=".text-gray-400 .hover:text-gray-600 .p-2 .rounded-full .hover:bg-gray-100"
                      onClick={() => resetMaxtime(mode)}
                    >
                      <XSVG class=".h-5 .w-5" />
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
