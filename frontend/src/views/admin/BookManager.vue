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
    BookOpen,
    Image as ImageIcon,
} from "lucide-vue-next";
import NeoButton from "@/components/ui/NeoButton.vue";
import NeoConfirmModal from "@/components/ui/NeoConfirmModal.vue";
import BookForm from "./BookForm.vue";
import CopyManagerModal from "./CopyManagerModal.vue";

import { useBooks } from "@/features/books/queries";
import { useDeleteBook } from "@/features/books/mutations";
import { useToast } from "@/composables/useToast";
import type { Sach } from "@/types/models/Sach";

const { data: books, isLoading, isError } = useBooks();
const { mutate: deleteBook } = useDeleteBook();
const { addToast } = useToast();

const searchQuery = ref<string>("");
const deleteId = ref<string | null>(null);

const selectedBookForCopies = ref<{ id: string; title: string } | null>(null);
const selectedBook = ref<Sach | undefined>(undefined);
const isFormOpen = ref<boolean>(false);

const filteredBooks = computed<Sach[]>(() => {
    const bookList = books.value || [];

    if (!searchQuery.value) return bookList;

    const lowerQuery = searchQuery.value.toLowerCase();
    return bookList.filter(
        (book: Sach) =>
            book.tenSach.toLowerCase().includes(lowerQuery) ||
            book.maSach.toLowerCase().includes(lowerQuery),
    );
});

const openCreateModal = () => {
    selectedBook.value = undefined;
    isFormOpen.value = true;
};

const openEditModal = (book: Sach) => {
    selectedBook.value = book;
    isFormOpen.value = true;
};

const closeFormModal = () => {
    isFormOpen.value = false;
    selectedBook.value = undefined;
};

const openCopyManager = (book: Sach) => {
    selectedBookForCopies.value = { id: book._id, title: book.tenSach };
};

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
        onError: (err) => {
            addToast({
                title: "Lỗi",
                description: err.message || "Không thể xóa sách.",
                variant: "error",
            });
            deleteId.value = null;
        },
    });
};

const getCategoryColor = (index: number): string => {
    const colors = ["bg-blue-200", "bg-green-200", "bg-yellow-200", "bg-pink-200"];
    return colors[index % colors.length]!;
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
                @click="openCreateModal"
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
            <p class="font-bold mb-6">Không thể lấy danh sách sách.</p>
            <NeoButton variant="danger" @click="$router.go(0)">Tải lại trang</NeoButton>
        </div>

        <div v-else class="bg-white border-4 border-black shadow-neo overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-yellow-300 border-b-4 border-black text-black">
                            <th
                                class="p-4 border-r-2 border-black font-black uppercase w-20 text-center"
                            >
                                Ảnh
                            </th>
                            <th class="p-4 border-r-2 border-black font-black uppercase w-24">
                                Mã
                            </th>
                            <th class="p-4 border-r-2 border-black font-black uppercase">
                                Thông tin Sách
                            </th>
                            <th class="p-4 border-r-2 border-black font-black uppercase w-48">
                                Tác giả & NXB
                            </th>
                            <th class="p-4 border-r-2 border-black font-black uppercase w-40">
                                Danh mục
                            </th>
                            <th
                                class="p-4 border-r-2 border-black font-black uppercase w-24 text-center"
                            >
                                Kho
                            </th>
                            <th class="p-4 font-black uppercase w-40 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y-2 divide-black">
                        <tr
                            v-for="book in filteredBooks"
                            :key="book._id"
                            class="hover:bg-purple-50 transition-colors group"
                        >
                            <td class="p-2 border-r-2 border-black align-middle text-center">
                                <div
                                    class="w-12 h-16 bg-gray-200 border-2 border-black mx-auto overflow-hidden flex items-center justify-center"
                                >
                                    <img
                                        v-if="book.hinhAnh"
                                        :src="book.hinhAnh"
                                        class="w-full h-full object-cover"
                                    />
                                    <ImageIcon v-else :size="20" class="text-gray-400" />
                                </div>
                            </td>

                            <td class="p-4 border-r-2 border-black align-middle">
                                <span
                                    class="font-mono font-bold bg-black text-white px-2 py-1 text-sm block text-center"
                                >
                                    {{ book.maSach }}
                                </span>
                            </td>

                            <td class="p-4 border-r-2 border-black align-middle">
                                <h4 class="font-black text-lg leading-tight mb-1">
                                    {{ book.tenSach }}
                                </h4>
                                <p class="text-sm font-bold text-gray-500">
                                    Năm XB: <span class="text-black">{{ book.namXuatBan }}</span>
                                </p>
                            </td>

                            <td class="p-4 border-r-2 border-black align-middle text-sm">
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
                                        {{ (book.nhaXuatBan as any)?.tenNhaXuatBan || "N/A" }}
                                    </p>
                                </div>
                            </td>

                            <td class="p-4 border-r-2 border-black align-middle">
                                <div class="flex flex-wrap gap-1">
                                    <span
                                        v-for="(dm, idx) in book.danhMuc"
                                        :key="dm._id"
                                        class="px-2 py-0.5 text-[10px] font-bold border border-black shadow-neo-sm"
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
                                    <BookOpen :size="18" class="text-gray-400" />
                                    <span>{{ book.soLuongBanSao || 0 }}</span>
                                </div>
                            </td>

                            <td class="p-4 align-middle text-center">
                                <div class="flex justify-center gap-2">
                                    <button
                                        @click="openCopyManager(book)"
                                        class="p-2 bg-blue-200 border-2 border-black shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:bg-blue-300 transition-all"
                                        title="Quản lý bản sao"
                                    >
                                        <CopyIcon :size="18" />
                                    </button>
                                    <button
                                        @click="openEditModal(book)"
                                        class="p-2 bg-white border-2 border-black shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:bg-gray-100 transition-all"
                                        title="Chỉnh sửa"
                                    >
                                        <Edit :size="18" />
                                    </button>
                                    <button
                                        @click="deleteId = book._id"
                                        class="p-2 bg-red-400 border-2 border-black shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:bg-red-500 transition-all text-black"
                                        title="Xóa"
                                    >
                                        <Trash2 :size="18" />
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="filteredBooks.length === 0">
                            <td colspan="7" class="p-12 text-center bg-gray-50">
                                <div class="flex flex-col items-center gap-3">
                                    <AlertCircle :size="40" class="text-gray-400" />
                                    <p class="font-bold text-gray-500 text-lg">
                                        Không tìm thấy sách nào phù hợp.
                                    </p>
                                    <NeoButton
                                        v-if="searchQuery"
                                        @click="searchQuery = ''"
                                        variant="secondary"
                                        class="text-sm"
                                    >
                                        Xóa bộ lọc
                                    </NeoButton>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="bg-white p-4 border-t-4 border-black flex justify-between items-center">
                <span class="font-bold text-sm">Hiển thị {{ filteredBooks.length }} kết quả</span>
            </div>
        </div>

        <BookForm
            v-if="isFormOpen"
            :book="selectedBook"
            @close="closeFormModal"
            @success="closeFormModal"
        />

        <CopyManagerModal
            v-if="selectedBookForCopies"
            :book-id="selectedBookForCopies.id"
            :book-title="selectedBookForCopies.title"
            @close="selectedBookForCopies = null"
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
