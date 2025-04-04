<script lang="ts">
  import { onMount } from 'svelte'
  import { Button, Input } from '~ui/components'
  import { commuteStore } from '~ui/stores'

  const STORAGE_KEY = 'commuteAddresses'
  const MAX_ADDRESSES = 2

  let newAddress = ''
  let editingAddress: string | null = null
  let editValue = ''

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
</script>

{#if $commuteStore.isOpen}
  <div
    class=".fixed .inset-0 .z-[9999] .flex .h-screen .w-screen .items-center .justify-center .bg-black/50 .backdrop-blur-sm"
  >
    <div class=".w-[500px] .bg-white .p-4 .duration-300">
      <div>
        <h1>Commute Modal</h1>

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
                  <Button onClick={() => handleDelete(address)}>Delete</Button>
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
      </div>
    </div>
  </div>
{/if}
