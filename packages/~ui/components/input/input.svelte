<script lang="ts">
  import { onMount, onDestroy } from 'svelte'

  // Types
  interface AddressInputProps {
    value: string
    placeholder?: string
    debounceMs?: number
    minChars?: number
  }

  // Props with defaults
  export let value: AddressInputProps['value'] = ''
  export let placeholder: AddressInputProps['placeholder'] = 'Enter address...'
  export let debounceMs: AddressInputProps['debounceMs'] = 300
  export let minChars: AddressInputProps['minChars'] = 3

  // State
  let suggestions: string[] = []
  let isLoading = false
  let isOpen = false
  let containerRef: HTMLDivElement | null = null
  let debounceTimeout: NodeJS.Timeout
  let lastThrottleTime = 0

  // Mock data - should be moved to a separate file in real application
  const mockAddresses = [
    '123 Main St, Anytown, USA',
    '456 Maple Ave, Othertown, USA',
    '789 Oak Blvd, Somecity, USA',
    '101 Pine St, Anothercity, USA',
    '202 Cedar Ave, Yetanothercity, USA',
  ]

  // Throttle function
  const throttle = (fn: Function, wait: number) => {
    const now = Date.now()
    if (now - lastThrottleTime >= wait) {
      fn()
      lastThrottleTime = now
    }
  }

  // Fetch suggestions with error handling
  const getSuggestions = async (query: string): Promise<void> => {
    try {
      // Don't search if query is shorter than minChars
      if (query.length < minChars) {
        suggestions = []
        isOpen = false
        return
      }

      isLoading = true
      // Simulate API call - replace with real API in production
      await new Promise(resolve => setTimeout(resolve, 1000))
      suggestions = mockAddresses
        .filter(address =>
          address.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 5)
      isOpen = true
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      suggestions = []
    } finally {
      isLoading = false
    }
  }

  // Event handlers
  const handleFocus = () => {
    if (value.length >= minChars) {
      isOpen = true
      getSuggestions(value)
    }
  }

  const handleInputChange = (event: Event) => {
    const inputValue = (event.target as HTMLInputElement).value
    clearTimeout(debounceTimeout)
    
    // Throttle and debounce combination
    debounceTimeout = setTimeout(() => {
      throttle(() => getSuggestions(inputValue), 500)
    }, debounceMs)
  }

  const handleSuggestionClick = (suggestion: string) => {
    value = suggestion
    isOpen = false
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef && !containerRef.contains(event.target as Node)) {
      isOpen = false
    }
  }

  // Cleanup
  onDestroy(() => {
    clearTimeout(debounceTimeout)
  })
</script>

<svelte:window on:click={handleClickOutside} />
<div 
  bind:this={containerRef} 
  class=".relative .w-full"
  role="combobox"
  aria-expanded={isOpen}
  aria-haspopup="listbox"
>
  <input
    type="text"
    bind:value
    on:input={handleInputChange}
    on:focus={handleFocus}
    class=".w-full .px-4 .py-2 .border .border-gray-300 .rounded-lg .shadow-sm .focus:outline-none .focus:ring-2 .focus:ring-blue-500 .focus:border-blue-500"
    {placeholder}
    aria-autocomplete="list"
    aria-controls="suggestions-list"
  />

  {#if isOpen && value.length >= minChars}
    <div
      id="suggestions-list"
      class=".absolute .z-50 .w-full .mt-1 .bg-white .border .border-gray-200 .rounded-lg .shadow-lg"
      role="listbox"
    >
      {#if isLoading}
        <div
          class=".flex .items-center .justify-center .p-4 .text-sm .text-gray-500"
          aria-live="polite"
        >
          Loading...
        </div>
      {:else if suggestions.length === 0}
        <div class=".p-4 .text-sm .text-center .text-gray-500">
          No suggestions found
        </div>
      {:else}
        <div class=".overflow-y-auto .max-h-60">
          {#each suggestions as suggestion, i}
            <button
              class=".w-full .px-4 hover:.bg-black/10 .py-2 .text-sm .text-left .text-gray-700 .transition-colors .duration-150 .hover:bg-gray-100"
              on:click={() => handleSuggestionClick(suggestion)}
              role="option"
              aria-selected={value === suggestion}
              id={`suggestion-${i}`}
            >
              {suggestion}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>
