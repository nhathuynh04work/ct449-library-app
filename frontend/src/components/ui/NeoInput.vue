<script setup lang="ts">
defineProps<{
    label: string;
    id: string;
    type?: string;
    modelValue: string | number;
    placeholder?: string;
}>();

defineEmits(["update:modelValue"]);
</script>

<template>
    <div class="flex flex-col gap-1">
        <label :for="id" class="font-bold text-sm ml-1">{{ label }}</label>
        <input
            :id="id"
            :type="type || 'text'"
            :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            :placeholder="placeholder"
            class="w-full p-3 border-2 border-black outline-none transition-all focus:shadow-neo-sm placeholder:text-gray-500 font-body"
        />
    </div>
</template>
