<script setup lang="ts">
import { computed } from "vue";
import { X, Plus, Trash2 } from "lucide-vue-next";
import NeoButton from "@/components/ui/NeoButton.vue";
import { useBookCopies } from "@/features/copies/queries";
import { useCreateCopy, useDeleteCopy, useUpdateCopyStatus } from "@/features/copies/mutations";
import { useToast } from "@/composables/useToast";

const props = defineProps<{
    bookId: string;
    bookTitle: string;
}>();

// Fix: Removed 'const emit =' as it was unused in script
defineEmits(["close"]);

const { addToast } = useToast();

const bookIdRef = computed(() => props.bookId);
const { data: copies, isLoading } = useBookCopies(bookIdRef);

const createCopy = useCreateCopy();
const deleteCopy = useDeleteCopy();
const updateStatus = useUpdateCopyStatus();

const handleAddCopy = () => {
    createCopy.mutate(props.bookId, {
        onSuccess: () =>
            addToast({
                title: "Thành công",
                description: "Đã thêm bản sao mới.",
                variant: "success",
            }),
        onError: () =>
            addToast({ title: "Lỗi", description: "Không thể thêm bản sao.", variant: "error" }),
    });
};

const handleDelete = (id: string) => {
    if (!confirm("Xóa bản sao này?")) return;
    deleteCopy.mutate(id, {
        onSuccess: () => addToast({ title: "Đã xóa", variant: "info" }),
    });
};

const handleStatusChange = (id: string, event: Event) => {
    const newStatus = (event.target as HTMLSelectElement).value;
    updateStatus.mutate(
        { id, status: newStatus },
        { onSuccess: () => addToast({ title: "Đã cập nhật", variant: "success" }) },
    );
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "AVAILABLE":
            return "bg-green-100 text-green-800 border-green-800";
        case "BORROWED":
            return "bg-yellow-100 text-yellow-800 border-yellow-800";
        case "LOST":
            return "bg-red-100 text-red-800 border-red-800";
        default:
            return "bg-gray-100 text-gray-800 border-gray-800";
    }
};
</script>

<template>
    <div
        class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="$emit('close')"
    >
        <div
            class="bg-white border-4 border-black shadow-neo w-full max-w-3xl animate-in flex flex-col max-h-[85vh]"
        >
            <div
                class="bg-blue-300 p-4 border-b-4 border-black flex justify-between items-center shrink-0"
            >
                <div>
                    <h2 class="text-xl font-black uppercase font-display">Quản Lý Bản Sao</h2>
                    <p class="font-bold text-sm text-blue-900 line-clamp-1 max-w-md">
                        {{ bookTitle }}
                    </p>
                </div>
                <button
                    @click="$emit('close')"
                    class="hover:bg-white/30 p-1 border-2 border-transparent hover:border-black transition-all"
                >
                    <X :size="24" />
                </button>
            </div>

            <div
                class="p-4 border-b-4 border-black bg-gray-50 flex justify-between items-center shrink-0"
            >
                <span class="font-bold text-lg">Tổng số: {{ copies?.length || 0 }} bản</span>
                <NeoButton
                    @click="handleAddCopy"
                    class="py-2 px-4 flex items-center gap-2 text-sm"
                    :disabled="createCopy.isPending.value"
                >
                    <Plus :size="18" /> Thêm Bản Sao
                </NeoButton>
            </div>

            <div class="overflow-y-auto p-4 flex-1">
                <div v-if="isLoading" class="text-center py-10 font-bold text-gray-500">
                    Đang tải...
                </div>
                <div
                    v-else-if="!copies || copies.length === 0"
                    class="text-center py-10 border-2 border-dashed border-gray-300"
                >
                    <p class="font-bold text-gray-400">Chưa có bản sao nào.</p>
                </div>
                <table v-else class="w-full text-left border-collapse">
                    <thead class="sticky top-0 bg-white z-10">
                        <tr class="border-b-2 border-black text-xs uppercase text-gray-500">
                            <th class="p-2 w-1/3">Mã Bản Sao</th>
                            <th class="p-2 w-1/3">Trạng Thái</th>
                            <th class="p-2 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="copy in copies" :key="copy._id" class="hover:bg-gray-50">
                            <td class="p-3 font-mono font-bold">{{ copy.maBanSao }}</td>
                            <td class="p-3">
                                <div class="relative inline-block w-40">
                                    <select
                                        :value="copy.trangThai"
                                        @change="(e) => handleStatusChange(copy._id, e)"
                                        class="appearance-none w-full font-bold text-xs px-3 py-1.5 border-2 rounded cursor-pointer outline-none focus:shadow-neo-sm transition-all"
                                        :class="getStatusColor(copy.trangThai)"
                                    >
                                        <option value="AVAILABLE">Sẵn sàng</option>
                                        <option value="BORROWED">Đang mượn</option>
                                        <option value="LOST">Đã mất</option>
                                        <option value="DAMAGED">Hư hỏng</option>
                                    </select>
                                </div>
                            </td>
                            <td class="p-3 text-right">
                                <button
                                    @click="handleDelete(copy._id)"
                                    class="p-2 hover:bg-red-100 text-red-600 rounded transition-colors"
                                    title="Xóa bản sao này"
                                >
                                    <Trash2 :size="18" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
