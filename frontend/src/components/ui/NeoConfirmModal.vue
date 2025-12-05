<script setup lang="ts">
import { AlertTriangle, Loader2, Info, CheckCircle } from "lucide-vue-next";
import NeoButton from "./NeoButton.vue";
import BaseModal from "@/components/common/BaseModal.vue";

defineProps<{
    title: string;
    description?: string;
    variant?: "danger" | "warning" | "info" | "success" | "primary";
    processing?: boolean;
}>();

defineEmits(["close", "confirm"]);

const getVariantData = (variant: string = "info") => {
    switch (variant) {
        case "danger":
            return { headerClass: "bg-red-400", icon: AlertTriangle, btn: "danger" };
        case "warning":
            return { headerClass: "bg-yellow-400", icon: AlertTriangle, btn: "secondary" };
        case "success":
            return { headerClass: "bg-green-400", icon: CheckCircle, btn: "primary" };
        case "primary":
            return { headerClass: "bg-blue-400", icon: Info, btn: "primary" };
        case "info":
        default:
            return { headerClass: "bg-gray-200", icon: Info, btn: "secondary" };
    }
};
</script>

<template>
    <BaseModal
        :isOpen="true"
        :title="title"
        :headerClass="getVariantData(variant).headerClass"
        @close="$emit('close')"
    >
        <div class="space-y-4">
            <p v-if="description" class="font-bold text-lg">{{ description }}</p>

            <div class="font-medium text-gray-600">
                <slot />
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t-2 border-black">
                <button
                    @click="$emit('close')"
                    class="px-4 py-2 font-bold border-2 hover:underline hover:bg-gray-200 transition-all border-black disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="processing"
                >
                    Hủy bỏ
                </button>
                <NeoButton
                    @click="$emit('confirm')"
                    :variant="getVariantData(variant).btn as any"
                    class="flex items-center gap-2"
                    :disabled="processing"
                >
                    <Loader2 v-if="processing" :size="20" class="animate-spin" />
                    <span v-else>Xác nhận</span>
                </NeoButton>
            </div>
        </div>
    </BaseModal>
</template>
