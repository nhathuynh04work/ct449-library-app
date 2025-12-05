<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
    Search,
    User as UserIcon,
    Tag,
    Image as ImageIcon,
    Filter,
    ArrowRight,
} from "lucide-vue-next";
import NeoButton from "@/components/ui/NeoButton.vue";
import NeoInput from "@/components/ui/NeoInput.vue";
import NeoSelect from "@/components/ui/NeoSelect.vue";
import NeoConfirmModal from "@/components/ui/NeoConfirmModal.vue";
import { useBooks } from "@/features/books/queries";
import { useAuthors, useCategories } from "@/features/resources/queries";
import { useBorrowBook } from "@/features/books/mutations";
import { useToast } from "@/composables/useToast";
import type { Sach } from "@/types/models/Sach";

const router = useRouter();
const { addToast } = useToast();

const { data: books, isLoading, isError } = useBooks();
const { data: authors } = useAuthors();
const { data: categories } = useCategories();
const { mutate: borrowBook, isPending: isBorrowing } = useBorrowBook();

const searchQuery = ref("");
const selectedAuthor = ref("");
const selectedCategory = ref("");
const showConfirm = ref(false);
const selectedBook = ref<Sach | null>(null);

const authorOptions = computed(() => [
    { value: "", label: "Tất cả tác giả" },
    ...(authors.value?.map((a) => ({ value: a._id, label: a.tenTacGia })) || []),
]);

const categoryOptions = computed(() => [
    { value: "", label: "Tất cả danh mục" },
    ...(categories.value?.map((c) => ({ value: c._id, label: c.tenDanhMuc })) || []),
]);

const filteredBooks = computed(() => {
    if (!books.value) return [];

    return books.value.filter((book) => {
        const query = searchQuery.value.toLowerCase();
        const matchesSearch =
            book.tenSach.toLowerCase().includes(query) || book.maSach.toLowerCase().includes(query);

        if (!matchesSearch) return false;
        if (selectedAuthor.value && !book.tacGia.some((t) => t._id === selectedAuthor.value))
            return false;
        if (selectedCategory.value && !book.danhMuc.some((d) => d._id === selectedCategory.value))
            return false;

        return true;
    });
});

const goToDetail = (id: string) => {
    router.push(`/portal/books/${id}`);
};

const confirmBorrow = (book: Sach) => {
    const token = localStorage.getItem("token");
    if (!token) {
        addToast({
            title: "Yêu cầu đăng nhập",
            description: "Vui lòng đăng nhập để mượn sách.",
            variant: "warning",
        });
        router.push("/login");
        return;
    }
    selectedBook.value = book;
    showConfirm.value = true;
};

const handleBorrow = () => {
    if (!selectedBook.value) return;

    borrowBook(selectedBook.value._id, {
        onSuccess: () => {
            addToast({
                title: "Yêu cầu đã gửi",
                description: `Yêu cầu mượn "${selectedBook.value?.tenSach}" đang chờ thủ thư duyệt.`,
                variant: "success",
            });
            showConfirm.value = false;
            selectedBook.value = null;
        },
        onError: (error) => {
            addToast({
                title: "Lỗi",
                description: error.message || "Không thể gửi yêu cầu.",
                variant: "error",
            });
            showConfirm.value = false;
        },
    });
};

const getRandomColor = (id: string) => {
    const colors = ["bg-blue-200", "bg-green-200", "bg-yellow-200", "bg-pink-200", "bg-purple-200"];
    return colors[id.charCodeAt(id.length - 1) % colors.length];
};
</script>

<template>
    <div>
        <div
            class="bg-white border-4 border-black p-4 mb-8 shadow-neo flex flex-col md:flex-row gap-4 items-end md:items-center"
        >
            <div class="flex items-center gap-2 text-xl font-black uppercase font-display mr-4">
                <Filter :size="24" />
                <span class="hidden md:inline">Bộ lọc</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div class="relative">
                    <NeoInput
                        id="search"
                        label=""
                        placeholder="Tìm tên sách, mã sách..."
                        v-model="searchQuery"
                        class="w-full"
                    />
                    <Search
                        class="absolute right-3 top-3 text-gray-400 pointer-events-none"
                        :size="20"
                    />
                </div>
                <NeoSelect
                    id="author-filter"
                    :options="authorOptions"
                    v-model="selectedAuthor"
                    placeholder="Tất cả tác giả"
                />
                <NeoSelect
                    id="category-filter"
                    :options="categoryOptions"
                    v-model="selectedCategory"
                    placeholder="Tất cả danh mục"
                />
            </div>
        </div>

        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
            <div
                class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black mb-4"
            ></div>
            <p class="font-bold font-display text-xl">ĐANG TẢI DỮ LIỆU...</p>
        </div>

        <div
            v-else-if="isError"
            class="bg-red-100 border-4 border-black p-8 text-center shadow-neo max-w-2xl mx-auto"
        >
            <h2 class="text-2xl font-black mb-2 text-red-600 uppercase">Lỗi kết nối</h2>
            <p class="font-bold mb-6">Không thể tải danh sách sách. Vui lòng thử lại sau.</p>
            <NeoButton @click="router.go(0)" variant="danger">Tải lại trang</NeoButton>
        </div>

        <div v-else-if="filteredBooks.length === 0" class="text-center py-20">
            <div class="bg-white border-4 border-black p-10 inline-block shadow-neo">
                <p class="font-bold text-xl mb-4">Không tìm thấy cuốn sách nào.</p>
                <NeoButton
                    @click="
                        searchQuery = '';
                        selectedAuthor = '';
                        selectedCategory = '';
                    "
                    variant="secondary"
                >
                    Xóa bộ lọc
                </NeoButton>
            </div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="book in filteredBooks" :key="book.maSach" class="group h-full">
                <div
                    class="h-full bg-white border-4 border-black shadow-neo flex flex-col transition-all duration-200 group-hover:-translate-y-2 group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                >
                    <div
                        class="h-48 border-b-4 border-black relative overflow-hidden flex items-center justify-center cursor-pointer"
                        :class="getRandomColor(book.maSach)"
                        @click="goToDetail(book._id)"
                    >
                        <ImageIcon :size="48" class="text-black/20" />
                        <div
                            class="absolute top-2 left-2 bg-black text-white text-xs font-mono font-bold px-2 py-1"
                        >
                            {{ book.maSach }}
                        </div>
                        <div
                            class="absolute bottom-2 right-2 bg-white border-2 border-black text-xs font-bold px-2 py-1 shadow-neo-sm"
                        >
                            {{ book.namXuatBan }}
                        </div>
                    </div>

                    <div class="p-5 flex-1 flex flex-col">
                        <h3
                            class="text-xl font-black font-display uppercase leading-tight mb-3 line-clamp-2 cursor-pointer hover:underline"
                            :title="book.tenSach"
                            @click="goToDetail(book._id)"
                        >
                            {{ book.tenSach }}
                        </h3>

                        <div class="space-y-2 mb-6 flex-1">
                            <div class="flex items-start gap-2 text-sm font-medium text-gray-700">
                                <UserIcon :size="16" class="mt-0.5 shrink-0" />
                                <span class="line-clamp-1 hover:text-black">
                                    {{ book.tacGia.map((tg) => tg.tenTacGia).join(", ") }}
                                </span>
                            </div>
                            <div class="flex items-start gap-2 text-sm font-medium text-gray-700">
                                <Tag :size="16" class="mt-0.5 shrink-0" />
                                <span class="line-clamp-1 hover:text-black">
                                    {{ book.danhMuc.map((dm) => dm.tenDanhMuc).join(", ") }}
                                </span>
                            </div>
                        </div>

                        <NeoButton
                            class="w-full text-sm py-3 flex justify-center items-center gap-2 group-hover:bg-yellow-400 transition-colors"
                            variant="primary"
                            @click="confirmBorrow(book)"
                            :disabled="isBorrowing"
                        >
                            ĐĂNG KÝ MƯỢN <ArrowRight :size="16" />
                        </NeoButton>
                    </div>
                </div>
            </div>
        </div>

        <NeoConfirmModal
            v-if="showConfirm"
            title="Xác nhận mượn sách"
            :description="`Bạn có chắc chắn muốn đăng ký mượn cuốn '${selectedBook?.tenSach}' không?`"
            variant="info"
            @close="showConfirm = false"
            @confirm="handleBorrow"
        />
    </div>
</template>
