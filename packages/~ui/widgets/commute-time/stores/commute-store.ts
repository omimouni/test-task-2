import { writable } from "svelte/store";
// import { Durations } from "~core/database";

// Define the transport types more strictly
type TransportType = 'walking' | 'driving' | 'transit' | 'biking';

// Update the Durations type if it doesn't exist
interface Durations {
    maxCommuteTimeWalking: number | null;
    maxCommuteTimeDriving: number | null;
    maxCommuteTimeTransit: number | null;
    maxCommuteTimeBiking: number | null;
}

export const createCommuteStore = () => {
    const commuteStore = writable<{
        isOpen: boolean,
        addresses: string[],
        maxCommuteTimeWalking: number | null,
        maxCommuteTimeDriving: number | null,
        maxCommuteTimeTransit: number | null,
        maxCommuteTimeBiking: number | null,
    }>({
        isOpen: false,
        addresses: [],
        maxCommuteTimeWalking: null,
        maxCommuteTimeDriving: null,
        maxCommuteTimeTransit: null,
        maxCommuteTimeBiking: null,
    });

    const { subscribe, update } = commuteStore;

    const open = () => update((state) => ({ ...state, isOpen: true }));
    const close = () => update((state) => ({ ...state, isOpen: false }));
    const toggle = () => update((state) => ({ ...state, isOpen: !state.isOpen }));

    const addAddress = (address: string) => update((state) => ({ ...state, addresses: [...state.addresses, address] }));
    const removeAddress = (index: number) => update((state) => ({ ...state, addresses: state.addresses.filter((_, i) => i !== index) }));
    const clearAddresses = () => update((state) => ({ ...state, addresses: [] }));
    const updateAddress = (index: number, value: string) => {
        console.log(value, index);
        return update((state) => ({ ...state, addresses: state.addresses.map((a, i) => i === index ? value : a) }));
    };

    const updateMaxCommuteTime = (type: TransportType, target: EventTarget) => {
        const input = target as HTMLInputElement;
        console.log(input.value, type);
        return update((state) => ({ 
            ...state, 
            [`maxCommuteTime${type.charAt(0).toUpperCase() + type.slice(1)}`]: input.value ? parseInt(input.value) : null 
        }));
    }
    
    const clearMaxCommuteTime = (type: TransportType) => update((state) => ({
        ...state,
        [`maxCommuteTime${type.charAt(0).toUpperCase() + type.slice(1)}`]: null
    }));

    return {
        subscribe,
        open,
        close,
        toggle,
        addAddress,
        removeAddress,
        clearAddresses,
        updateAddress,
        updateMaxCommuteTime,
        clearMaxCommuteTime,
    }
}

export const commuteStore = createCommuteStore();