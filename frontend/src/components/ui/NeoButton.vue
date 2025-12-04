<script setup lang="ts">
defineProps<{
    variant?: "primary" | "secondary" | "danger";
}>();
</script>

<template>
    <button
        class="px-6 py-3 font-bold border-2 border-black transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-opacity-90"
        :class="{
            'bg-purple-400 text-black shadow-neo': variant === 'primary' || !variant,
            'bg-white text-black shadow-neo': variant === 'secondary',
            'bg-red-400 text-black shadow-neo': variant === 'danger',
        }"
    >
        <slot />
    </button>
</template>
