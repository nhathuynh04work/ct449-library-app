<script setup lang="ts">
import { X } from "lucide-vue-next";
import type { Toast } from "@/composables/useToast";

defineProps<{
    toast: Toast;
}>();

defineEmits(["close"]);
</script>

<template>
    <div
        class="w-80 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative transition-all duration-300 transform translate-x-0"
        :class="{
            'bg-green-300': toast.variant === 'success',
            'bg-red-300': toast.variant === 'error',
            'bg-yellow-300': toast.variant === 'warning',
            'bg-blue-300': toast.variant === 'info' || !toast.variant,
        }"
    >
        <button
            @click="$emit('close')"
            class="absolute top-2 right-2 p-1 hover:bg-white/50 border-2 border-transparent hover:border-black transition-all"
        >
            <X :size="16" />
        </button>

        <h4 class="font-display font-bold text-lg uppercase mb-1 pr-6">{{ toast.title }}</h4>
        <p v-if="toast.description" class="font-body text-sm font-medium">
            {{ toast.description }}
        </p>
    </div>
</template>
