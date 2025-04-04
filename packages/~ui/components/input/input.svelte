<script lang="ts">
  import { onMount } from 'svelte'

  let mockAddresses = [
    '123 Main St, Anytown, USA',
    '456 Maple Ave, Othertown, USA',
    '789 Oak Blvd, Somecity, USA',
    '101 Pine St, Anothercity, USA',
    '202 Cedar Ave, Yetanothercity, USA',
  ]

  export let value = ''
  let suggestions: string[] = []
  let isLoading = true
  let isOpen = false
  let containerRef: HTMLDivElement | null = null

  const getSuggestions = async (suggestion: string) => {
    isLoading = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    suggestions = mockAddresses
      .filter(address =>
        address.toLowerCase().includes(suggestion.toLowerCase()),
      )
      .slice(0, 5)
    isLoading = false
  }

  const handleFocus = () => {
    // console.log('focus')
    isOpen = true
    getSuggestions(value)
  }

  const handleBlur = () => {
    // console.log('blur')
    isOpen = false
  }

  const handleSuggestionClick = (suggestion: string) => {
    // console.log('suggestion clicked', suggestion)
    value = suggestion
    isOpen = false
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef && !containerRef.contains(event.target as Node)) {
      console.log('clicked outside')
      isOpen = false
    }
  }

  //   TODO: make this debounce more sophisticated // using lodash but don't want to add a dependency as requested per assignment
  let debounceTimeout: NodeJS.Timeout
  const handleInputChange = (event: Event) => {
    const inputValue = (event.target as HTMLInputElement).value
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      getSuggestions(inputValue)
    }, 300)
  }


</script>

<svelte:window on:click={handleClickOutside} />
<div bind:this={containerRef} class=".relative .w-full">
  <input
    type="text"
    on:input={handleInputChange}
    bind:value
    on:focus={handleFocus}
    class=".focus:outline-none .focus:ring-2 .focus:ring-blue-500 .focus:border-blue-500 .w-full .rounded-lg .border .border-gray-300 .px-4 .py-2 .shadow-sm"
    placeholder="Enter address..."
  />
  {#if isOpen}
    <div
      class=".absolute .z-50 .mt-1 .w-full .rounded-lg .border .border-gray-200 .bg-white .shadow-lg"
    >
      {#if isLoading}
        <div
          class=".flex .items-center .justify-center .p-4 .text-sm .text-gray-500"
        >
          <div class=".mr-2 .animate-spin">⌛</div>
          Loading...
        </div>
      {:else}
        <div class=".max-h-60 .overflow-y-auto">
          {#each suggestions as suggestion}
            <button
              class="hover:. .hover:bg-gray-100 .w-full .px-4 .py-2 .text-left .text-sm .text-gray-700 .transition-colors .duration-150"
              on:click={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>
