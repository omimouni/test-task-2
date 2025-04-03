<script lang="ts">
  import { Button } from '~ui/components'
  import { onMount } from 'svelte'

  export let is_extension: boolean = false
  export let isOpen: boolean = true

  // Tab state
  let activeTab: 'addresses' | 'preferences' = 'addresses'

  // Addresses state
  let addresses = ['', '']
  let tmpAddresses = ['', '']
  let showSecondAddress = false

  // Commute preferences state
  let commutePreferences = {
    driving: '',
    walking: '',
    biking: '',
    transit: ''
  }
  let tmpCommutePreferences = { ...commutePreferences }

  let isLoading = true
  let suggestions: string[] = []
  let activeInput: 0 | 1 | null = null
  let selectedIndex = -1

  // Mock addresses for demonstration
  const mockAddresses = [
    'Damrak 1, 1012 LG Amsterdam',
    'Prins Hendrikkade 108, 1011 AK Amsterdam',
    'Nieuwezijds Voorburgwal 147, 1012 RJ Amsterdam',
    'Rokin 78, 1012 KW Amsterdam',
    'Dam 20, 1012 NP Amsterdam',
    'Kalverstraat 92, 1012 PH Amsterdam',
    'Herengracht 595, 1017 CE Amsterdam',
    'Keizersgracht 324, 1016 EZ Amsterdam',
    'Prinsengracht 263, 1016 GV Amsterdam',
    'Leidseplein 26, 1017 PT Amsterdam',
  ]

  // NOTE: Sorry, I know this is a hack, but I'm not sure how to do this otherwise.
  const env = (import.meta as any).env
  const domain = env.VITE_API_DOMAIN || 'uprent.nl'

  const setCookie = async (name: string, value: string) => {
    if (!is_extension) {
      document.cookie = `${name}=${value}; path=/; domain=${domain}; expires=Fri, 31 Dec 9999 23:59:59 GMT`
      return true
    }

    const cookie: boolean = await new Promise<boolean>((resolve) => {
      chrome.runtime.sendMessage(
        { type: 'SET_COOKIE', name, value },
        response => {
          resolve(response.success)
        },
      )
    })

    return cookie
  }

  const getCookie = async (name: string): Promise<string> => {
    if (!is_extension) {
      return (
        document.cookie
          .split('; ')
          .find(row => row.startsWith(`${name}=`))
          ?.split('=')[1] || ''
      )
    }

    const cookie: string = await new Promise<string>((resolve) => {
      chrome.runtime.sendMessage({ type: 'GET_COOKIE', name }, response => {
        resolve(response.value)
      })
    })

    return cookie
  }

  onMount(async () => {
    isLoading = true
    try {
      // Load addresses
      const savedAddress = await getCookie('commute-address')
      const savedAddress2 = await getCookie('commute-address-2')
      
      addresses[0] = savedAddress
      addresses[1] = savedAddress2
      tmpAddresses = [...addresses]
      showSecondAddress = !!savedAddress2

      // Load commute preferences
      const modes = ['driving', 'walking', 'biking', 'transit']
      for (const mode of modes) {
        const value = await getCookie(`commute-${mode}`)
        commutePreferences[mode] = value
        tmpCommutePreferences[mode] = value
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      isLoading = false
    }
  })

  const onSave = async () => {
    if (activeTab === 'addresses') {
      if (!tmpAddresses[0].trim()) return

      addresses = [...tmpAddresses]
      await setCookie('commute-address', addresses[0])
      
      if (showSecondAddress && tmpAddresses[1].trim()) {
        await setCookie('commute-address-2', addresses[1])
      } else {
        await setCookie('commute-address-2', '')
        addresses[1] = ''
        tmpAddresses[1] = ''
      }
    } else {
      commutePreferences = { ...tmpCommutePreferences }
      for (const [mode, value] of Object.entries(tmpCommutePreferences)) {
        await setCookie(`commute-${mode}`, value)
      }
    }
    
    isOpen = false
  }

  const resetPreference = async (mode: string) => {
    tmpCommutePreferences[mode] = ''
    commutePreferences[mode] = ''
    await setCookie(`commute-${mode}`, '')
  }

  const toggleSecondAddress = () => {
    showSecondAddress = !showSecondAddress
    if (!showSecondAddress) {
      tmpAddresses[1] = ''
    }
  }

  const deleteAddress = async (index: number) => {
    if (index === 0) {
      // If deleting first address, move second address to first if it exists
      if (addresses[1]) {
        addresses[0] = addresses[1]
        tmpAddresses[0] = addresses[1]
        addresses[1] = ''
        tmpAddresses[1] = ''
        await setCookie('commute-address', addresses[0])
        await setCookie('commute-address-2', '')
        showSecondAddress = false
      } else {
        addresses[0] = ''
        tmpAddresses[0] = ''
        await setCookie('commute-address', '')
      }
    } else {
      addresses[1] = ''
      tmpAddresses[1] = ''
      await setCookie('commute-address-2', '')
      showSecondAddress = false
    }
  }

  const onClose = () => {
    isOpen = false
    tmpAddresses = [...addresses]
    showSecondAddress = !!addresses[1]
  }

  function getSuggestions(query: string): string[] {
    if (!query.trim()) return []
    
    const normalizedQuery = query.toLowerCase()
    return mockAddresses.filter(address => 
      address.toLowerCase().includes(normalizedQuery)
    ).slice(0, 5) // Limit to 5 suggestions
  }

  function handleInput(index: number, event: Event) {
    const input = event.target as HTMLInputElement
    const value = input.value
    
    activeInput = index as 0 | 1
    selectedIndex = -1
    suggestions = getSuggestions(value)
  }

  function selectSuggestion(suggestion: string) {
    if (activeInput !== null) {
      tmpAddresses[activeInput] = suggestion
    }
    suggestions = []
    activeInput = null
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!suggestions.length) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1)
        break
      case 'ArrowUp':
        event.preventDefault()
        selectedIndex = Math.max(selectedIndex - 1, -1)
        break
      case 'Enter':
        event.preventDefault()
        if (selectedIndex >= 0) {
          selectSuggestion(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        suggestions = []
        activeInput = null
        break
    }
  }
</script>

<div 
  class="uprent-reset .fixed {isOpen ? '.block' : '.hidden'} .left-0 .top-0 .z-[9999] .flex .h-screen .w-screen .items-center .justify-center .bg-black/50"
>
  <div class=".p-6 .bg-white .rounded-xl .relative .min-w-[400px] .max-w-[90vw] .shadow-2xl">
    <button
      class=".absolute .right-4 .top-4 .text-gray-400 .hover:text-gray-600 .transition-colors .w-8 .h-8 .flex .items-center .justify-center .rounded-full .hover:bg-gray-100"
      on:click={onClose}
    >
      ✕
    </button>

    <h1 class=".mb-6 .text-2xl .font-semibold .text-gray-800">Commute Time</h1>

    <!-- Tabs -->
    <div class=".flex .space-x-1 .mb-6 .border-b .border-gray-200">
      <button
        class=".px-4 .py-2 .font-medium .transition-colors {activeTab === 'addresses' ? '.text-primary .border-b-2 .border-primary' : '.text-gray-500 .hover:text-gray-700'}"
        on:click={() => activeTab = 'addresses'}
      >
        Addresses
      </button>
      <button
        class=".px-4 .py-2 .font-medium .transition-colors {activeTab === 'preferences' ? '.text-primary .border-b-2 .border-primary' : '.text-gray-500 .hover:text-gray-700'}"
        on:click={() => activeTab = 'preferences'}
      >
        Max Duration
      </button>
    </div>

    {#if isLoading}
      <div class=".flex .justify-center .items-center .py-12">
        <div class=".animate-spin .rounded-full .h-10 .w-10 .border-[3px] .border-gray-200 .border-t-primary"></div>
      </div>
    {:else}
      {#if activeTab === 'addresses'}
        <div class=".space-y-5">
          <div class=".relative">
            <label class=".block .text-sm .font-medium .text-gray-700 .mb-2">Primary Address</label>
            <input
              type="text"
              placeholder="Enter your primary address"
              class=".w-full .px-4 .py-3 .border .border-gray-300 .rounded-lg .shadow-sm .focus:ring-2 .focus:ring-primary .focus:border-primary .transition-all {addresses[0] ? '.pr-10' : ''}"
              bind:value={tmpAddresses[0]}
              on:input={(e) => handleInput(0, e)}
              on:keydown={handleKeydown}
            />
            {#if addresses[0]}
              <button
                class=".absolute .right-3 .top-[38px] .text-gray-400 .hover:text-red-500 .transition-colors .w-6 .h-6 .flex .items-center .justify-center .rounded-full .hover:bg-red-50"
                on:click={() => deleteAddress(0)}
              >
                ✕
              </button>
            {/if}
            
            {#if activeInput === 0 && suggestions.length > 0}
              <div class=".absolute .left-0 .right-0 .top-[74px] .bg-white .border .rounded-lg .shadow-lg .z-50 .max-h-60 .overflow-auto">
                {#each suggestions as suggestion, i}
                  <button
                    class=".w-full .text-left .px-4 .py-3 .hover:bg-primary/10 .transition-colors {selectedIndex === i ? '.bg-primary/10 .text-primary' : ''}"
                    on:click={() => selectSuggestion(suggestion)}
                  >
                    {suggestion}
                  </button>
                {/each}
              </div>
            {/if}
          </div>

          {#if !showSecondAddress && addresses.filter(a => a).length < 2}
            <Button 
              class=".w-full .py-2 .bg-primary/50 .hover:bg-primary/80 .transition-colors .rounded-lg .font-medium" 
              onClick={toggleSecondAddress}
            >
              + Add Second Address
            </Button>
          {/if}

          {#if showSecondAddress}
            <div class=".relative">
              <label class=".block .text-sm .font-medium .text-gray-700 .mb-2">Secondary Address</label>
              <input
                type="text"
                placeholder="Enter your secondary address"
                class=".w-full .px-4 .py-3 .border .border-gray-300 .rounded-lg .shadow-sm .focus:ring-2 .focus:ring-primary .focus:border-primary .transition-all {addresses[1] ? '.pr-10' : ''}"
                bind:value={tmpAddresses[1]}
                on:input={(e) => handleInput(1, e)}
                on:keydown={handleKeydown}
              />
              <button
                class=".absolute .right-3 .top-[38px] .text-gray-400 .hover:text-red-500 .transition-colors .w-6 .h-6 .flex .items-center .justify-center .rounded-full .hover:bg-red-50"
                on:click={() => deleteAddress(1)}
              >
                ✕
              </button>
              
              {#if activeInput === 1 && suggestions.length > 0}
                <div class=".absolute .left-0 .right-0 .top-[74px] .bg-white .border .rounded-lg .shadow-lg .z-50 .max-h-60 .overflow-auto">
                  {#each suggestions as suggestion, i}
                    <button
                      class=".w-full .text-left .px-4 .py-3 .hover:bg-primary/10 .transition-colors {selectedIndex === i ? '.bg-primary/10 .text-primary' : ''}"
                      on:click={() => selectSuggestion(suggestion)}
                    >
                      {suggestion}
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}

          {#if addresses[0] || addresses[1]}
            <div class=".mt-4 .pt-4 .border-t .border-gray-200">
              <h3 class=".text-sm .font-medium .text-gray-700 .mb-3">Saved Addresses</h3>
              <div class=".space-y-2">
                {#if addresses[0]}
                  <div class=".flex .items-center .gap-2 .p-3 .bg-gray-50 .rounded-lg">
                    <div class=".w-8 .h-8 .bg-primary/10 .text-primary .rounded-full .flex .items-center .justify-center .font-medium">1</div>
                    <p class=".text-sm .text-gray-600 .flex-1">{addresses[0]}</p>
                  </div>
                {/if}
                {#if addresses[1]}
                  <div class=".flex .items-center .gap-2 .p-3 .bg-gray-50 .rounded-lg">
                    <div class=".w-8 .h-8 .bg-primary/10 .text-primary .rounded-full .flex .items-center .justify-center .font-medium">2</div>
                    <p class=".text-sm .text-gray-600 .flex-1">{addresses[1]}</p>
                  </div>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      {:else}
        <div class=".space-y-5">
          {#each Object.entries(tmpCommutePreferences) as [mode, value]}
            <div class=".relative">
              <label class=".block .text-sm .font-medium .text-gray-700 .mb-2 .capitalize">
                {mode} Time
              </label>
              <div class=".flex .gap-2">
                <input
                  type="number"
                  min="1"
                  placeholder="Enter max minutes"
                  class=".flex-1 .px-4 .py-3 .border .border-gray-300 .rounded-lg .shadow-sm .focus:ring-2 .focus:ring-primary .focus:border-primary .transition-all"
                  bind:value={tmpCommutePreferences[mode]}
                />
                {#if value}
                  <button
                    class=".px-3 .text-gray-400 .hover:text-red-500 .transition-colors .rounded-lg .hover:bg-red-50"
                    on:click={() => resetPreference(mode)}
                  >
                    Reset
                  </button>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {/if}

      <div class=".flex .gap-3 .mt-6">
        <Button 
          class=".flex-1 .py-3 .px-4 .bg-gray-100 .text-gray-700 .hover:bg-gray-200 .transition-colors .rounded-lg .font-medium" 
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          class=".flex-1 .py-3 .px-4 .bg-primary .text-white .hover:bg-primary/90 .transition-colors .rounded-lg .font-medium .disabled:opacity-50 .disabled:cursor-not-allowed" 
          onClick={onSave}
          disabled={activeTab === 'addresses' && !tmpAddresses[0].trim()}
        >
          Save Changes
        </Button>
      </div>
    {/if}
  </div>
</div>
