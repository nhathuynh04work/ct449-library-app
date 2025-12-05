<script setup lang="ts">
import { AlertTriangle, X, Loader2 } from "lucide-vue-next";
import NeoButton from "./NeoButton.vue";

defineProps<{
    title: string;
    description: string;
    variant?: "danger" | "warning" | "info";
    processing?: boolean; // New prop
}>();

defineEmits(["close", "confirm"]);
</script>

<template>
    <div
        class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="!processing && $emit('close')"
    >
        <div
            class="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md relative animate-in"
        >
            <div class="bg-red-400 p-4 border-b-4 border-black flex items-center gap-3">
                <AlertTriangle :size="24" class="text-black" stroke-width="3" />
                <h2 class="text-xl font-black uppercase font-display">{{ title }}</h2>
                <button
                    v-if="!processing"
                    @click="$emit('close')"
                    class="ml-auto hover:bg-white/30 p-1 border-2 border-transparent hover:border-black transition-all"
                >
                    <X :size="20" />
                </button>
            </div>

            <div class="p-6">
                <p class="font-bold text-lg mb-2">Bạn có chắc chắn không?</p>
                <p class="font-medium text-gray-600">{{ description }}</p>
            </div>

            <div class="p-4 border-t-4 border-black bg-gray-50 flex justify-end gap-3">
                <button
                    @click="$emit('close')"
                    class="px-4 py-2 font-bold border-2 hover:underline hover:bg-gray-200 transition-all border-black disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="processing"
                >
                    Hủy bỏ
                </button>
                <NeoButton
                    @click="$emit('confirm')"
                    variant="danger"
                    class="flex items-center gap-2"
                    :disabled="processing"
                >
                    <Loader2 v-if="processing" :size="20" class="animate-spin" />
                    <span v-else>Xác nhận</span>
                </NeoButton>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-in {
    animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes popIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
