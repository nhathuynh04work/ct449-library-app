<script setup lang="ts">
import { ref, computed } from "vue";
import {
    Search,
    Plus,
    Trash2,
    Edit,
    AlertCircle,
    Loader2,
    Copy as CopyIcon,
} from "lucide-vue-next";
import NeoButton from "@/components/ui/NeoButton.vue";
import { useBooks } from "@/features/books/queries";
import { useDeleteBook } from "@/features/books/mutations";
import { useToast } from "@/composables/useToast";
import BookForm from "./BookForm.vue";
import NeoConfirmModal from "@/components/ui/NeoConfirmModal.vue";

// Data & Queries
const { data: books, isLoading, isError } = useBooks();
const { mutate: deleteBook, isPending: isDeleting } = useDeleteBook();
const { addToast } = useToast();

const searchQuery = ref("");
const isCreateModalOpen = ref(false);
const deleteId = ref<string | null>(null);

// Filter Books
const filteredBooks = computed(() => {
    if (!books.value) return [];
    if (!searchQuery.value) return books.value;

    const lowerQuery = searchQuery.value.toLowerCase();
    return books.value.filter(
        (book) =>
            book.tenSach.toLowerCase().includes(lowerQuery) ||
            book.maSach.toLowerCase().includes(lowerQuery),
    );
});

// Actions
const confirmDelete = () => {
    if (!deleteId.value) return;

    deleteBook(deleteId.value, {
        onSuccess: () => {
            addToast({
                title: "Thành công",
                description: "Đã xóa sách khỏi hệ thống.",
                variant: "success",
            });
            deleteId.value = null;
        },
        onError: (err: any) => {
            addToast({
                title: "Lỗi",
                description: err.message || "Không thể xóa sách.",
                variant: "error",
            });
            deleteId.value = null;
        },
    });
};

// Helper for badges
const getCategoryColor = (index: number) => {
    const colors = ["bg-blue-200", "bg-green-200", "bg-yellow-200", "bg-pink-200"];
    return colors[index % colors.length];
};
</script>

<template>
    <div class="space-y-6">
        <div
            class="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 border-4 border-black shadow-neo"
        >
            <div class="relative w-full md:w-96">
                <Search class="absolute left-3 top-3 text-gray-500" :size="20" />
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Tìm theo tên hoặc mã sách..."
                    class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-black font-bold outline-none focus:shadow-neo-sm transition-all placeholder:font-normal"
                />
            </div>

            <NeoButton
                @click="isCreateModalOpen = true"
                class="w-full md:w-auto flex items-center justify-center gap-2"
            >
                <Plus :size="20" stroke-width="3" />
                Thêm Sách Mới
            </NeoButton>
        </div>

        <div
            v-if="isLoading"
            class="flex flex-col items-center justify-center py-20 bg-white border-4 border-black shadow-neo"
        >
            <Loader2 :size="48" class="animate-spin text-black mb-4" />
            <p class="font-bold text-xl uppercase">Đang tải dữ liệu...</p>
        </div>

        <div
            v-else-if="isError"
            class="bg-red-100 border-4 border-black p-8 text-center shadow-neo"
        >
            <AlertCircle :size="48" class="text-red-600 mx-auto mb-4" />
            <h3 class="text-2xl font-black uppercase text-red-600 mb-2">Lỗi tải dữ liệu</h3>
            <p class="font-bold mb-6">Không thể lấy danh sách sách. Vui lòng thử lại sau.</p>
            <NeoButton variant="danger" @click="$router.go(0)">Tải lại trang</NeoButton>
        </div>

        <div v-else class="bg-white border-4 border-black shadow-neo overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-yellow-300 border-b-4 border-black text-black">
                            <th
                                class="p-4 border-r-2 border-black font-black uppercase tracking-wide w-24"
                            >
                                Mã
                            </th>
                            <th
                                class="p-4 border-r-2 border-black font-black uppercase tracking-wide"
                            >
                                Thông tin Sách
                            </th>
                            <th
                                class="p-4 border-r-2 border-black font-black uppercase tracking-wide w-48"
                            >
                                Tác giả & NXB
                            </th>
                            <th
                                class="p-4 border-r-2 border-black font-black uppercase tracking-wide w-48"
                            >
                                Danh mục
                            </th>
                            <th
                                class="p-4 border-r-2 border-black font-black uppercase tracking-wide w-32 text-center"
                            >
                                Bản sao
                            </th>
                            <th class="p-4 font-black uppercase tracking-wide w-32 text-center">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y-2 divide-black">
                        <tr
                            v-for="book in filteredBooks"
                            :key="book._id"
                            class="hover:bg-purple-50 transition-colors group"
                        >
                            <td class="p-4 border-r-2 border-black align-top">
                                <span
                                    class="font-mono font-bold bg-black text-white px-2 py-1 text-sm"
                                >
                                    {{ book.maSach }}
                                </span>
                            </td>

                            <td class="p-4 border-r-2 border-black align-top">
                                <h4 class="font-black text-lg leading-tight mb-1">
                                    {{ book.tenSach }}
                                </h4>
                                <p class="text-sm font-bold text-gray-500">
                                    Năm XB: <span class="text-black">{{ book.namXuatBan }}</span>
                                </p>
                            </td>

                            <td class="p-4 border-r-2 border-black align-top text-sm">
                                <div class="mb-2">
                                    <p class="text-[10px] uppercase font-bold text-gray-500">
                                        Tác giả
                                    </p>
                                    <p
                                        class="font-bold truncate"
                                        :title="book.tacGia.map((t) => t.tenTacGia).join(', ')"
                                    >
                                        {{ book.tacGia.map((t) => t.tenTacGia).join(", ") }}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-[10px] uppercase font-bold text-gray-500">
                                        Nhà Xuất Bản
                                    </p>
                                    <p class="font-medium truncate">
                                        {{ book.nhaXuatBan.tenNhaXuatBan }}
                                    </p>
                                </div>
                            </td>

                            <td class="p-4 border-r-2 border-black align-top">
                                <div class="flex flex-wrap gap-2">
                                    <span
                                        v-for="(dm, idx) in book.danhMuc"
                                        :key="dm._id"
                                        class="px-2 py-1 text-xs font-bold border border-black shadow-neo-sm"
                                        :class="getCategoryColor(idx)"
                                    >
                                        {{ dm.tenDanhMuc }}
                                    </span>
                                </div>
                            </td>

                            <td class="p-4 border-r-2 border-black align-middle text-center">
                                <div
                                    class="flex items-center justify-center gap-1 font-black text-lg"
                                >
                                    <CopyIcon :size="16" class="text-gray-500" />
                                    {{ book.soLuongBanSao || 0 }}
                                </div>
                            </td>

                            <td class="p-4 align-middle text-center">
                                <div class="flex justify-center gap-2">
                                    <button
                                        class="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:bg-gray-100 transition-all"
                                        title="Chỉnh sửa"
                                    >
                                        <Edit :size="18" />
                                    </button>
                                    <button
                                        @click="deleteId = book.maSach"
                                        class="p-2 bg-red-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:bg-red-500 transition-all text-black"
                                        title="Xóa"
                                    >
                                        <Trash2 :size="18" />
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="filteredBooks.length === 0">
                            <td colspan="6" class="p-8 text-center bg-gray-50">
                                <p class="font-bold text-gray-500">
                                    Không tìm thấy sách nào phù hợp.
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="bg-white p-4 border-t-4 border-black flex justify-between items-center">
                <span class="font-bold text-sm">Hiển thị {{ filteredBooks.length }} kết quả</span>
                <div class="flex gap-2">
                    <button
                        class="px-3 py-1 border-2 border-black font-bold disabled:opacity-50"
                        disabled
                    >
                        Trước
                    </button>
                    <button class="px-3 py-1 border-2 border-black bg-black text-white font-bold">
                        1
                    </button>
                    <button class="px-3 py-1 border-2 border-black font-bold hover:bg-gray-100">
                        2
                    </button>
                    <button class="px-3 py-1 border-2 border-black font-bold hover:bg-gray-100">
                        Sau
                    </button>
                </div>
            </div>
        </div>

        <BookForm
            v-if="isCreateModalOpen"
            @close="isCreateModalOpen = false"
            @success="isCreateModalOpen = false"
        />

        <NeoConfirmModal
            v-if="deleteId"
            title="Xóa Sách"
            description="Bạn có chắc chắn muốn xóa cuốn sách này? Hành động này không thể hoàn tác."
            variant="danger"
            @close="deleteId = null"
            @confirm="confirmDelete"
        />
    </div>
</template>
