<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { ChevronDown, Check } from "lucide-vue-next";
import { useSmartPosition } from "@/composables/useSmartPosition";

export interface SelectOption {
    value: string | number;
    label: string;
}

const props = defineProps<{
    label?: string;
    id: string;
    modelValue: string | number;
    options: SelectOption[];
    placeholder?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const { position, calculatePosition } = useSmartPosition();

const selectedLabel = computed(() => {
    const selected = props.options.find((opt) => opt.value === props.modelValue);
    return selected ? selected.label : props.placeholder || "Chọn...";
});

const toggleDropdown = () => {
    if (!isOpen.value) {
        calculatePosition(triggerRef.value);
    }
    isOpen.value = !isOpen.value;
};

const selectOption = (value: string | number) => {
    emit("update:modelValue", value);
    isOpen.value = false;
};

// Close when clicking outside
const handleClickOutside = (e: MouseEvent) => {
    if (triggerRef.value && !triggerRef.value.contains(e.target as Node)) {
        isOpen.value = false;
    }
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));
</script>

<template>
    <div class="flex flex-col gap-1" ref="triggerRef">
        <label v-if="label" :for="id" class="font-bold text-sm ml-1 font-display">{{
            label
        }}</label>

        <div class="relative">
            <button
                type="button"
                :id="id"
                @click="toggleDropdown"
                class="w-full p-3 border-2 border-black bg-white outline-none transition-all flex items-center justify-between hover:shadow-neo-sm min-h-[52px]"
                :class="{ 'shadow-neo-sm': isOpen }"
            >
                <span :class="modelValue ? 'text-black font-medium' : 'text-gray-500'">
                    {{ selectedLabel }}
                </span>
                <ChevronDown
                    :size="20"
                    class="transition-transform duration-200"
                    :class="{ 'rotate-180': isOpen }"
                />
            </button>

            <div
                v-if="isOpen"
                class="absolute left-0 right-0 border-2 border-black bg-white shadow-neo z-50 max-h-60 overflow-y-auto"
                :class="position === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'"
            >
                <div
                    v-for="opt in options"
                    :key="opt.value"
                    @click="selectOption(opt.value)"
                    class="p-3 hover:bg-yellow-100 cursor-pointer flex items-center justify-between transition-colors text-sm font-medium"
                    :class="{ 'bg-blue-50 font-bold': modelValue === opt.value }"
                >
                    {{ opt.label }}
                    <Check v-if="modelValue === opt.value" :size="16" class="text-blue-600" />
                </div>

                <div v-if="options.length === 0" class="p-4 text-center text-gray-500 text-sm">
                    Không có dữ liệu
                </div>
            </div>
        </div>
    </div>
</template>
