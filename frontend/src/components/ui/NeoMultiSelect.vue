<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Check, ChevronDown, X } from "lucide-vue-next";

export interface SelectOption {
    value: string;
    label: string;
}

const props = defineProps<{
    label?: string;
    id: string;
    modelValue: string[];
    options: SelectOption[];
    placeholder?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const dropdownRef = ref<HTMLDivElement | null>(null);

const selectedLabels = computed(() => {
    return props.options
        .filter((opt) => props.modelValue.includes(opt.value))
        .map((opt) => opt.label);
});

const toggleOption = (value: string) => {
    const newValue = [...props.modelValue];
    const index = newValue.indexOf(value);
    if (index === -1) {
        newValue.push(value);
    } else {
        newValue.splice(index, 1);
    }
    emit("update:modelValue", newValue);
};

const removeItem = (e: Event, value: string) => {
    e.stopPropagation();
    toggleOption(value);
};

// Close when clicking outside
const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
        isOpen.value = false;
    }
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));
</script>

<template>
    <div class="flex flex-col gap-1" ref="dropdownRef">
        <label v-if="label" :for="id" class="font-bold text-sm ml-1 font-display">{{
            label
        }}</label>

        <div class="relative">
            <div
                @click="isOpen = !isOpen"
                class="w-full min-h-[52px] p-2 border-2 border-black bg-white cursor-pointer transition-all hover:shadow-neo-sm flex items-center justify-between gap-2"
                :class="{ 'shadow-neo-sm': isOpen }"
            >
                <div v-if="modelValue.length > 0" class="flex flex-wrap gap-2">
                    <span
                        v-for="val in modelValue"
                        :key="val"
                        class="bg-yellow-200 border border-black px-2 py-1 text-xs font-bold flex items-center gap-1"
                    >
                        {{ options.find((o) => o.value === val)?.label }}
                        <button @click="(e) => removeItem(e, val)" class="hover:text-red-600">
                            <X :size="12" />
                        </button>
                    </span>
                </div>
                <span v-else class="text-gray-500 pl-1">{{ placeholder || "Chọn..." }}</span>

                <ChevronDown
                    :size="20"
                    class="shrink-0 transition-transform"
                    :class="{ 'rotate-180': isOpen }"
                />
            </div>

            <div
                v-if="isOpen"
                class="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-black max-h-60 overflow-y-auto z-50 shadow-neo"
            >
                <div
                    v-for="opt in options"
                    :key="opt.value"
                    @click="toggleOption(opt.value)"
                    class="p-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between font-medium text-sm"
                    :class="{ 'bg-blue-50': modelValue.includes(opt.value) }"
                >
                    {{ opt.label }}
                    <Check v-if="modelValue.includes(opt.value)" :size="16" class="text-blue-600" />
                </div>
                <div v-if="options.length === 0" class="p-3 text-gray-500 text-sm text-center">
                    Không có dữ liệu
                </div>
            </div>
        </div>
    </div>
</template>
