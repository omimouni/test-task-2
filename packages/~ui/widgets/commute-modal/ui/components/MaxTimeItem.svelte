<script lang="ts">
  import { CarSVG, BusSVG, BikeSVG, WalkSVG, XSVG } from '~ui/assets'
  import { Button } from '~ui/components'
  import type { Maxtime } from '~ui/stores'

  // Define the valid modes as a type
  type TransportMode = 'driving' | 'transit' | 'biking' | 'walking'

  // Props with type annotations
  export let mode: keyof Maxtime
  export let value: number | null
  export let onChange: () => void
  export let onReset: () => void

  const getIcon = (mode: TransportMode) => {
    switch (mode) {
      case 'driving': return CarSVG
      case 'transit': return BusSVG
      case 'biking': return BikeSVG
      case 'walking': return WalkSVG
      default: return null
    }
  }

  $: Icon = getIcon(mode as TransportMode)
</script>

<div class=".flex .items-center .gap-6 .rounded-lg .p-4">
  <div class=".w-32 .flex .items-center .gap-3">
    <div class=".text-gray-600">
      {#if Icon}
        <svelte:component this={Icon} />
      {/if}
    </div>
    <span class=".text-base .text-gray-900 .capitalize">{mode}</span>
  </div>

  <div class=".relative .flex-1">
    <div class=".relative .flex .w-full .items-stretch .rounded-lg .border {value !== null && value <= 0 ? '.border-red-300' : '.border-gray-200'}">
      <input
        type="number"
        min="1"
        placeholder="0"
        bind:value
        on:input={onChange}
        class=".w-full .px-4 .py-2.5 .text-right .text-gray-900 .placeholder-gray-400 .focus:outline-none .appearance-none .bg-transparent"
      />
      <div class=".flex .items-center .px-4 .border-l .border-inherit .text-gray-500">
        min
      </div>
    </div>
    {#if value !== null && value <= 0}
      <div class=".absolute .-bottom-6 .left-0 .flex .items-center .gap-1.5 .text-red-500">
        <XSVG class=".h-3.5 .w-3.5" />
        <span class=".text-sm">Please enter a positive number</span>
      </div>
    {/if}
  </div>

  <div class=".w-10 .flex .items-center .justify-center">
    {#if value !== null}
      <Button
        class=".text-gray-400 .p-2 .rounded-full .hover:bg-gray-100 .transition-colors"
        onClick={onReset}
        title="Reset time limit"
      >
        <XSVG class=".h-4 .w-4" />
      </Button>
    {/if}
  </div>
</div> 