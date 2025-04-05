<script lang="ts">
  import { Button, Input } from '~ui/components'
  import { MapPinSVG, PencilSVG, TrashSVG, CheckSVG, XSVG } from '~ui/assets'

  export let address: string
  export let onEdit: (address: string) => void
  export let onDelete: (address: string) => void
  export let onSave: (oldAddress: string, newAddress: string) => void
  export let isEditing: boolean
  export let editValue: string
  export let onCancelEdit: () => void
</script>

<div class=".group .flex .items-center .justify-between .rounded-lg .border .border-gray-200 .p-4 .hover:bg-gray-50 .transition-colors">
  {#if isEditing}
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
        onClick={() => onSave(address, editValue)}
      >
        <CheckSVG />
      </Button>
      <Button 
        class=".text-gray-600 .p-2 .rounded-full .hover:bg-gray-100 .transition-colors"
        title="Cancel"
        onClick={onCancelEdit}
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
    <div class=".flex .gap-2">
      <Button 
        class=".p-2 .rounded-full .text-gray-600 .hover:bg-gray-100 .transition-colors"
        title="Edit address"
        onClick={() => onEdit(address)}
      >
        <PencilSVG />
      </Button>
      <Button 
        class=".p-2 .rounded-full .text-red-600 .hover:bg-red-50 .transition-colors"
        title="Delete address"
        subtle
        onClick={() => onDelete(address)}
      >
        <TrashSVG />
      </Button>
    </div>
  {/if}
</div> 