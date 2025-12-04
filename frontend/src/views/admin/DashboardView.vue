<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Library, LogOut, Plus, Trash2, Edit, Search, Users, ClipboardList } from "lucide-vue-next";
import NeoButton from "@/components/ui/NeoButton.vue";
import NeoInput from "@/components/ui/NeoInput.vue";
import Logo from "@/assets/logo-icon.svg";
import { useBooks } from "@/features/books/queries";
import { useDeleteBook } from "@/features/books/mutations";
import { useToast } from "@/composables/useToast";
import { getUserFromLocalStorage } from "@/lib/utils/getUserFromLocalStorage";
import type { NhanVien } from "@/types/models/NhanVien";

const router = useRouter();
const { addToast } = useToast();
const { data: books, isLoading } = useBooks();
const { mutate: deleteBook } = useDeleteBook();

const searchQuery = ref("");
const showDeleteModal = ref(false);
const bookToDelete = ref<string | null>(null);
const currentUser = ref<null | NhanVien>(null);

onMounted(() => {
    currentUser.value = getUserFromLocalStorage();
});

const filteredBooks = computed(() => {
    if (!books.value) return [];
    const q = searchQuery.value.toLowerCase();
    return books.value.filter(
        (b) => b.tenSach.toLowerCase().includes(q) || b.maSach.toLowerCase().includes(q),
    );
});

const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
};

const confirmDelete = (id: string) => {
    bookToDelete.value = id;
    showDeleteModal.value = true;
};

const handleDelete = () => {
    if (bookToDelete.value) {
        deleteBook(bookToDelete.value, {
            onSuccess: () => {
                addToast({
                    title: "Thành công",
                    description: "Đã xóa sách khỏi hệ thống.",
                    variant: "success",
                });
                showDeleteModal.value = false;
            },
            onError: () => {
                addToast({
                    title: "Lỗi",
                    description: "Không thể xóa sách này.",
                    variant: "error",
                });
            },
        });
    }
};

const navigateToAdd = () => {
    addToast({
        title: "Tính năng",
        description: "Chức năng thêm sách sẽ được cập nhật sau.",
        variant: "info",
    });
};
</script>

<template>
    <div class="min-h-screen bg-purple-50 flex flex-col md:flex-row font-display">
        <aside
            class="w-full md:w-64 bg-white border-r-4 border-black flex flex-col h-auto md:h-screen sticky top-0 z-30"
        >
            <div class="p-6 border-b-4 border-black bg-yellow-400">
                <div class="flex items-center gap-3">
                    <img
                        :src="Logo"
                        alt="Storism Logo"
                        class="h-10 w-10 border-2 border-black shadow-neo-sm bg-white p-1"
                    />
                    <div>
                        <h1 class="font-black text-2xl uppercase leading-none tracking-tighter">
                            Storism
                        </h1>
                        <p class="text-xs font-bold font-mono mt-1 text-black/70">Admin Portal</p>
                    </div>
                </div>
            </div>

            <div v-if="currentUser" class="p-4 border-b-4 border-black bg-pink-50">
                <p class="text-xs font-bold text-gray-500 uppercase mb-1">Đang đăng nhập:</p>
                <h2 class="font-black text-lg leading-tight uppercase">
                    {{ currentUser.hoLot }} {{ currentUser.ten }}
                </h2>
                <div
                    class="mt-2 inline-block bg-white border-2 border-black px-2 py-0.5 text-xs font-bold font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                    MSNV: {{ currentUser.maNhanVien }}
                </div>
            </div>

            <nav class="flex-1 p-4 space-y-2">
                <a
                    href="#"
                    class="flex items-center gap-3 p-3 bg-blue-100 border-2 border-black shadow-neo-sm font-bold"
                >
                    <Library :size="20" /> Quản lý Sách
                </a>
                <a
                    href="#"
                    class="flex items-center gap-3 p-3 hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all font-medium text-gray-500 hover:text-black"
                >
                    <Users :size="20" /> Độc giả
                </a>
                <a
                    href="#"
                    class="flex items-center gap-3 p-3 hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all font-medium text-gray-500 hover:text-black"
                >
                    <ClipboardList :size="20" /> Mượn / Trả
                </a>
            </nav>

            <div class="p-4 border-t-4 border-black">
                <button
                    @click="handleLogout"
                    class="w-full flex items-center justify-center gap-2 p-3 border-2 border-black hover:bg-red-400 hover:text-white transition-colors font-bold shadow-neo-sm hover:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                >
                    <LogOut :size="20" /> Đăng Xuất
                </button>
            </div>
        </aside>

        <main class="flex-1 p-6 md:p-10 overflow-y-auto">
            <div
                class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
            >
                <div>
                    <h2 class="text-4xl font-black uppercase mb-2">Kho Sách</h2>
                    <p class="font-body text-gray-600 font-medium">Quản lý và cập nhật đầu sách</p>
                </div>

                <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div class="relative">
                        <NeoInput
                            id="search-admin"
                            label=""
                            v-model="searchQuery"
                            placeholder="Tìm theo tên, mã..."
                            class="mb-0! min-w-[250px]"
                        />
                        <Search class="absolute right-3 top-3.5 text-gray-400" :size="20" />
                    </div>
                    <NeoButton
                        @click="navigateToAdd"
                        variant="primary"
                        class="flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus :size="20" /> Thêm Sách Mới
                    </NeoButton>
                </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="bg-white border-2 border-black p-4 shadow-neo-sm">
                    <span class="text-gray-500 font-bold text-xs uppercase">Tổng số sách</span>
                    <p class="text-3xl font-black">{{ books?.length || 0 }}</p>
                </div>
            </div>

            <div v-if="isLoading" class="text-center py-20">
                <div
                    class="animate-spin inline-block w-8 h-8 border-4 border-black border-t-transparent rounded-full"
                ></div>
            </div>

            <div v-else class="grid grid-cols-1 gap-4">
                <div
                    v-for="book in filteredBooks"
                    :key="book.maSach"
                    class="bg-white border-2 border-black p-4 flex flex-col md:flex-row items-center justify-between gap-4 hover:shadow-neo transition-all"
                >
                    <div class="flex items-center gap-4 w-full">
                        <div
                            class="h-16 w-12 bg-gray-200 border-2 border-black shrink-0 flex items-center justify-center font-black text-gray-400"
                        >
                            IMG
                        </div>
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <span
                                    class="bg-black text-white text-xs px-1.5 py-0.5 font-mono font-bold"
                                    >{{ book.maSach }}</span
                                >
                                <span
                                    class="bg-green-100 border border-black text-xs px-1.5 py-0.5 font-bold"
                                    >{{ book.namXuatBan }}</span
                                >
                            </div>
                            <h3 class="font-bold text-lg leading-tight">{{ book.tenSach }}</h3>
                            <p class="text-sm text-gray-500 font-medium">
                                {{ book.tacGia.map((t) => t.tenTacGia).join(", ") }}
                            </p>
                        </div>
                    </div>

                    <div
                        class="flex items-center gap-2 w-full md:w-auto border-t-2 md:border-t-0 border-dashed border-gray-300 pt-4 md:pt-0 mt-2 md:mt-0"
                    >
                        <button
                            class="p-2 border-2 border-black hover:bg-yellow-300 transition-colors shadow-neo-sm hover:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                            title="Chỉnh sửa"
                        >
                            <Edit :size="18" />
                        </button>
                        <button
                            @click="confirmDelete(book.maSach)"
                            class="p-2 border-2 border-black hover:bg-red-400 hover:text-white transition-colors shadow-neo-sm hover:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                            title="Xóa"
                        >
                            <Trash2 :size="18" />
                        </button>
                    </div>
                </div>

                <div
                    v-if="filteredBooks.length === 0"
                    class="text-center py-10 bg-white border-2 border-black border-dashed"
                >
                    <p class="font-bold text-gray-500">Không tìm thấy sách nào phù hợp.</p>
                </div>
            </div>
        </main>

        <div
            v-if="showDeleteModal"
            class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
            <div
                class="bg-white border-4 border-black p-6 max-w-sm w-full shadow-neo animate-bounce-in"
            >
                <h3 class="text-xl font-black uppercase text-red-600 mb-2">Xác nhận xóa?</h3>
                <p class="font-medium mb-6">
                    Bạn có chắc chắn muốn xóa cuốn sách này không? Hành động này không thể hoàn tác.
                </p>
                <div class="flex gap-4">
                    <NeoButton @click="showDeleteModal = false" variant="secondary" class="flex-1"
                        >Hủy</NeoButton
                    >
                    <NeoButton @click="handleDelete" variant="danger" class="flex-1"
                        >Xóa Ngay</NeoButton
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes bounce-in {
    0% {
        transform: scale(0.9);
        opacity: 0;
    }
    50% {
        transform: scale(1.05);
        opacity: 1;
    }
    100% {
        transform: scale(1);
    }
}
.animate-bounce-in {
    animation: bounce-in 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>
