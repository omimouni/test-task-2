<script lang="ts">
  export let activeTab: 'addresses' | 'maxtime'
  export let onTabChange: (tab: 'addresses' | 'maxtime') => void
</script>

<ul class=".flex .items-center .gap-6 .border-b .border-gray-200">
  <li>
    <button
      class=".border-b-2 .border-transparent .px-4 .py-3 .text-gray-600 .font-medium {activeTab === 'addresses'
        ? '!.border-primary .text-primary'
        : ''}"
      on:click={() => onTabChange('addresses')}>Addresses</button
    >
  </li>
  <li>
    <button
      class=".border-b-2 .border-transparent .px-4 .py-3 .text-gray-600 .font-medium {activeTab === 'maxtime'
        ? '!.border-primary .text-primary'
        : ''}"
      on:click={() => onTabChange('maxtime')}>Max Time</button
    >
  </li>
</ul> 