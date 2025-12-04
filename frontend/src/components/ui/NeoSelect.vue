<script setup lang="ts">
export interface SelectOption {
    value: string | number;
    label: string;
}

defineProps<{
    label?: string;
    id: string;
    modelValue: string | number;
    options: SelectOption[];
    placeholder?: string;
}>();

defineEmits(["update:modelValue"]);
</script>

<template>
    <div class="flex flex-col gap-1">
        <label v-if="label" :for="id" class="font-bold text-sm ml-1 font-display">{{
            label
        }}</label>

        <div class="relative">
            <select
                :id="id"
                :value="modelValue"
                @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
                class="w-full p-3 border-2 border-black outline-none bg-white appearance-none transition-all focus:shadow-neo-sm font-body cursor-pointer h-[52px]"
            >
                <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
                <option v-for="opt in options" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                </option>
            </select>

            <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="4"
                    stroke-linecap="square"
                    stroke-linejoin="miter"
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </div>
        </div>
    </div>
</template>
