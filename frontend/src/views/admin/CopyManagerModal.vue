<script setup lang="ts">
import { computed } from "vue";
import { Plus, Trash2 } from "lucide-vue-next";
import NeoButton from "@/components/ui/NeoButton.vue";
import BaseModal from "@/components/common/BaseModal.vue";
import { useBookCopies } from "@/features/copies/queries";
import { useCreateCopy, useDeleteCopy, useUpdateCopyStatus } from "@/features/copies/mutations";
import { useToast } from "@/composables/useToast";

const props = defineProps<{
    bookId: string;
    bookTitle: string;
}>();

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
    deleteCopy.mutate(id, {
        onSuccess: () => addToast({ title: "Đã xóa", variant: "info" }),
        onError: (err) => {
            addToast({
                title: "Lỗi xóa bản sao",
                description: err.message,
                variant: "error",
            });
        },
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
    <BaseModal
        :isOpen="true"
        title="Quản Lý Bản Sao"
        headerClass="bg-blue-300"
        @close="$emit('close')"
    >
        <div class="space-y-4">
            <p class="font-bold text-blue-900 border-b-2 border-dashed border-black pb-2">
                Sách: {{ bookTitle }}
            </p>

            <div class="flex justify-between items-center bg-gray-50 p-3 border-2 border-black">
                <span class="font-bold">Tổng số: {{ copies?.length || 0 }} bản</span>
                <NeoButton
                    @click="handleAddCopy"
                    class="py-1 px-3 text-sm flex items-center gap-2"
                    :disabled="createCopy.isPending.value"
                >
                    <Plus :size="16" /> Thêm
                </NeoButton>
            </div>

            <div class="overflow-y-auto max-h-[400px] border-2 border-black">
                <div v-if="isLoading" class="text-center py-10 font-bold text-gray-500">
                    Đang tải...
                </div>
                <div v-else-if="!copies || copies.length === 0" class="text-center py-10">
                    <p class="font-bold text-gray-400">Chưa có bản sao nào.</p>
                </div>
                <table v-else class="w-full text-left border-collapse">
                    <thead class="sticky top-0 bg-white z-10 shadow-sm">
                        <tr
                            class="border-b-2 border-black text-xs uppercase text-gray-500 bg-gray-50"
                        >
                            <th class="p-3 w-1/3">Mã Bản Sao</th>
                            <th class="p-3 w-1/3">Trạng Thái</th>
                            <th class="p-3 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="copy in copies" :key="copy._id" class="hover:bg-blue-50">
                            <td class="p-3 font-mono font-bold">{{ copy.maBanSao }}</td>
                            <td class="p-3">
                                <div class="relative inline-block w-full">
                                    <select
                                        :value="copy.trangThai"
                                        @change="(e) => handleStatusChange(copy._id, e)"
                                        class="appearance-none w-full font-bold text-xs px-2 py-1.5 border-2 rounded cursor-pointer outline-none focus:shadow-neo-sm transition-all"
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
                                    <Trash2 :size="16" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </BaseModal>
</template>
