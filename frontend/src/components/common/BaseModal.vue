<template>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-50">
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <DialogPanel
                            class="w-full max-w-2xl transform overflow-hidden bg-white text-left align-middle shadow-neo border-4 border-black transition-all"
                        >
                            <div
                                class="bg-yellow-300 border-b-4 border-black p-4 flex justify-between items-center"
                            >
                                <DialogTitle
                                    as="h3"
                                    class="text-xl font-black uppercase tracking-wide text-black"
                                >
                                    {{ title }}
                                </DialogTitle>
                                <button
                                    @click="closeModal"
                                    class="p-1 hover:bg-black hover:text-white transition-colors border-2 border-transparent hover:border-white"
                                >
                                    <X :size="24" stroke-width="3" />
                                </button>
                            </div>

                            <div class="p-6 max-h-[80vh] overflow-y-auto">
                                <slot></slot>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { X } from "lucide-vue-next";

defineProps<{
    isOpen: boolean;
    title: string;
}>();

const emit = defineEmits(["close"]);

const closeModal = () => {
    emit("close");
};
</script>
