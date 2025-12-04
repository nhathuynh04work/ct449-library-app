<script setup lang="ts">
import { useToast } from "@/composables/useToast";
import NeoToast from "./NeoToast.vue";

const { toasts, removeToast } = useToast();
</script>

<template>
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-4">
        <TransitionGroup
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform translate-x-full opacity-0"
            enter-to-class="transform translate-x-0 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform translate-x-0 opacity-100"
            leave-to-class="transform translate-x-full opacity-0"
        >
            <NeoToast
                v-for="toast in toasts"
                :key="toast.id"
                :toast="toast"
                @close="removeToast(toast.id)"
            />
        </TransitionGroup>
    </div>
</template>
