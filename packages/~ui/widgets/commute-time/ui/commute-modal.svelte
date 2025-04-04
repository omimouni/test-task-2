<script lang="ts">
  import { Button } from '~ui/components'
  import { commuteStore } from '../stores/commute-store'

  let activeTab: 'addresses' | 'settings' = 'addresses'
</script>

<div
  class=".fixed .h-screen {$commuteStore.isOpen
    ? '.block'
    : '.hidden'} .inset-0 .z-[99999] .flex .w-screen .items-center .justify-center .bg-black/20 .backdrop-blur-sm"
>
  <button
    class=".absolute .right-0 .top-0 .h-full .w-full .p-4"
    on:click={() => commuteStore.close()}
  >
  </button>
  <div class=".z-10 .bg-white .p-4">
    <h4>Commute Time</h4>

    <ul class=".flex .gap-2">
      <button
        class={activeTab === 'addresses' ? '.bg-gray-200' : ''}
        on:click={() => (activeTab = 'addresses')}
        on:keydown={e => {
          if (e.key === 'Enter') {
            activeTab = 'addresses'
          }
        }}
      >
        Addresses
      </button>
      <button
        class={activeTab === 'settings' ? '.bg-gray-200' : ''}
        on:click={() => (activeTab = 'settings')}
        on:keydown={e => {
          if (e.key === 'Enter') {
            activeTab = 'settings'
          }
        }}
      >
        Settings
      </button>
    </ul>

    {#if activeTab === 'addresses'}
      <div>
        <div>
          {#each $commuteStore.addresses as address, index}
            <div class=".flex .gap-2">
              <input
                type="text"
                value={address}
                on:input={e =>
                  commuteStore.updateAddress(index, e.target.value)}
              />
              {index}
              <button on:click={() => commuteStore.removeAddress(index)}
                >remove</button
              >
            </div>
          {/each}
        </div>

        <div class=".flex .gap-2">
          <Button
            disabled={$commuteStore.addresses.length > 1}
            onClick={() => commuteStore.addAddress('')}>add address</Button
          >
          <Button onClick={() => commuteStore.clearAddresses()}>clear</Button>
        </div>
      </div>
    {:else}
      <div class=".flex .flex-col .gap-2">
        <input 
            type="number" 
            value={$commuteStore.maxCommuteTimeWalking} 
            on:input={e => commuteStore.updateMaxCommuteTime('walking', e.target)} 
        />
        <input 
            type="number" 
            value={$commuteStore.maxCommuteTimeDriving} 
            on:input={e => commuteStore.updateMaxCommuteTime('driving', e.target)} 
        />
        <input 
            type="number" 
            value={$commuteStore.maxCommuteTimeTransit} 
            on:input={e => commuteStore.updateMaxCommuteTime('transit', e.target)} 
        />
        <input 
            type="number" 
            value={$commuteStore.maxCommuteTimeBiking} 
            on:input={e => commuteStore.updateMaxCommuteTime('biking', e.target)} 
        />

        <div class=".flex .gap-2">
          <Button>cancel</Button>
          <Button>save</Button>
        </div>
      </div>
    {/if}
  </div>
</div>
