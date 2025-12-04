<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { Search, LogOut, BookOpen, User as UserIcon, Tag } from "lucide-vue-next";
import NeoButton from "@/components/ui/NeoButton.vue";
import NeoInput from "@/components/ui/NeoInput.vue";
import { useBooks } from "@/features/books/queries";

const router = useRouter();
const { data: books, isLoading, isError } = useBooks();
const searchQuery = ref("");

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

const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    router.push("/login");
};

const getRandomColor = (id: string) => {
    const colors = ["bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-pink-100", "bg-purple-100"];
    const index = id.charCodeAt(id.length - 1) % colors.length;
    return colors[index];
};
</script>

<template>
    <div
        class="min-h-screen bg-white"
        style="
            background-image: radial-gradient(#000 1px, transparent 1px);
            background-size: 20px 20px;
        "
    >
        <header class="bg-yellow-400 border-b-4 border-black p-4 sticky top-0 z-20 shadow-neo">
            <div
                class="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4"
            >
                <div class="flex items-center gap-3">
                    <div class="bg-white p-2 border-2 border-black shadow-neo-sm">
                        <BookOpen :size="24" />
                    </div>
                    <h1 class="text-2xl font-black uppercase font-display tracking-wide">
                        Thư Viện Trực Tuyến
                    </h1>
                </div>

                <div class="flex items-center gap-4 w-full md:w-auto">
                    <div class="relative w-full md:w-64">
                        <NeoInput
                            id="search"
                            label=""
                            placeholder="Tìm kiếm sách..."
                            v-model="searchQuery"
                            class="mb-0!"
                        />
                        <Search class="absolute right-3 top-3.5 text-gray-500" :size="20" />
                    </div>
                    <button
                        @click="handleLogout"
                        class="bg-red-400 p-3 border-2 border-black shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                        title="Đăng xuất"
                    >
                        <LogOut :size="20" />
                    </button>
                </div>
            </div>
        </header>

        <main class="container mx-auto p-6">
            <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
                <div
                    class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black mb-4"
                ></div>
                <p class="font-bold font-display text-xl">ĐANG TẢI DỮ LIỆU...</p>
            </div>

            <div
                v-else-if="isError"
                class="bg-red-100 border-4 border-black p-8 text-center shadow-neo max-w-2xl mx-auto mt-10"
            >
                <h2 class="text-2xl font-black mb-2 text-red-600 uppercase">Đã xảy ra lỗi</h2>
                <p class="font-body font-bold mb-6">
                    Không thể tải danh sách sách. Vui lòng thử lại sau.
                </p>
                <NeoButton @click="router.go(0)" variant="primary">Tải lại trang</NeoButton>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div v-for="book in filteredBooks" :key="book.maSach" class="group relative">
                    <div
                        class="h-full border-4 border-black p-5 flex flex-col justify-between transition-all duration-200 group-hover:-translate-y-2 group-hover:shadow-neo"
                        :class="getRandomColor(book.maSach)"
                    >
                        <div>
                            <div class="flex justify-between items-start mb-4">
                                <span
                                    class="bg-black text-white px-2 py-1 font-mono font-bold text-xs"
                                >
                                    {{ book.maSach }}
                                </span>
                                <span
                                    class="border-2 border-black bg-white px-2 py-1 font-bold text-xs shadow-neo-sm"
                                >
                                    {{ book.namXuatBan }}
                                </span>
                            </div>

                            <h3
                                class="text-xl font-black font-display uppercase leading-tight mb-2 line-clamp-2"
                                :title="book.tenSach"
                            >
                                {{ book.tenSach }}
                            </h3>

                            <div class="space-y-2 mb-6">
                                <div class="flex items-start gap-2 text-sm font-medium">
                                    <UserIcon :size="16" class="mt-0.5 shrink-0" />
                                    <span class="line-clamp-1">
                                        {{ book.tacGia.map((tg) => tg.tenTacGia).join(", ") }}
                                    </span>
                                </div>
                                <div class="flex items-start gap-2 text-sm font-medium">
                                    <Tag :size="16" class="mt-0.5 shrink-0" />
                                    <span class="line-clamp-1">
                                        {{ book.danhMuc.map((dm) => dm.tenDanhMuc).join(", ") }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <NeoButton
                            class="w-full text-sm py-2 flex justify-center items-center gap-2"
                            variant="secondary"
                        >
                            XEM CHI TIẾT
                        </NeoButton>
                    </div>
                </div>
            </div>

            <div
                v-if="!isLoading && !isError && filteredBooks.length === 0"
                class="text-center py-20"
            >
                <div class="bg-white border-4 border-black p-10 inline-block shadow-neo">
                    <p class="font-bold text-xl mb-4">Không tìm thấy cuốn sách nào.</p>
                    <NeoButton @click="searchQuery = ''" variant="primary">Xóa bộ lọc</NeoButton>
                </div>
            </div>
        </main>
    </div>
</template>
