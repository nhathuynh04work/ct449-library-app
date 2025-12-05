<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, User, Tag, BookOpen, Calendar, LogIn, Building, Info } from "lucide-vue-next";
import NeoButton from "@/components/ui/NeoButton.vue";
import { useBook } from "@/features/books/queries";
import { useBorrowBook } from "@/features/books/mutations";
import { useToast } from "@/composables/useToast";
import NeoConfirmModal from "@/components/ui/NeoConfirmModal.vue";

const route = useRoute();
const router = useRouter();
const bookId = computed(() => route.params.id as string);

const { data: book, isLoading, isError } = useBook(bookId);
const { mutate: borrowBook, isPending } = useBorrowBook();
const { addToast } = useToast();

const showConfirm = ref(false);
const isLoggedIn = ref(false);

onMounted(() => {
    isLoggedIn.value = !!localStorage.getItem("token");
});

const handleMainAction = () => {
    if (!isLoggedIn.value) {
        router.push("/login");
        return;
    }
    showConfirm.value = true;
};

const handleBorrow = () => {
    borrowBook(bookId.value, {
        onSuccess: () => {
            addToast({
                title: "Thành công",
                description: "Đã gửi yêu cầu mượn sách.",
                variant: "success",
            });
            showConfirm.value = false;
        },
        onError: (err) => {
            addToast({ title: "Lỗi", description: err.message, variant: "error" });
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
    <div class="w-full max-w-5xl mx-auto space-y-8 pb-10">
        <div class="flex justify-start">
            <NeoButton @click="router.back()" variant="secondary" class="flex items-center gap-2">
                <ArrowLeft :size="20" /> Quay lại danh sách
            </NeoButton>
        </div>

        <div
            v-if="isLoading"
            class="flex flex-col items-center justify-center py-20 bg-white border-4 border-black shadow-neo"
        >
            <div
                class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black mb-4"
            ></div>
            <p class="font-black text-xl uppercase font-display">Đang tải thông tin sách...</p>
        </div>

        <div
            v-else-if="isError || !book"
            class="bg-red-100 border-4 border-black p-10 text-center shadow-neo"
        >
            <h2 class="text-3xl font-black text-red-600 uppercase mb-2">Không tìm thấy sách</h2>
            <p class="font-bold text-black">Cuốn sách này không tồn tại hoặc đã bị xóa.</p>
            <NeoButton @click="router.push('/portal/books')" variant="danger" class="mt-6">
                Về trang chủ
            </NeoButton>
        </div>

        <div
            v-else
            class="bg-white border-4 border-black shadow-neo grid grid-cols-1 md:grid-cols-12 relative"
        >
            <div
                class="absolute -top-4 -right-4 z-10 bg-black text-white font-mono font-bold text-lg px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] rotate-2"
            >
                {{ book.maSach }}
            </div>

            <div
                class="md:col-span-5 lg:col-span-4 border-b-4 md:border-b-0 md:border-r-4 border-black min-h-[400px] md:min-h-[500px] flex items-center justify-center relative overflow-hidden bg-gray-100 p-8"
                :class="!book.hinhAnh ? getRandomColor(book._id) : ''"
            >
                <div
                    class="relative w-full h-full border-4 border-black bg-white shadow-neo-sm transform transition-transform hover:-rotate-1"
                >
                    <img
                        v-if="book.hinhAnh"
                        :src="book.hinhAnh"
                        :alt="book.tenSach"
                        class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center bg-gray-50">
                        <BookOpen :size="80" class="text-gray-300" stroke-width="1.5" />
                    </div>
                </div>
            </div>

            <div class="md:col-span-7 lg:col-span-8 p-6 md:p-10 flex flex-col">
                <h1
                    class="text-4xl md:text-5xl font-black font-display uppercase mb-6 leading-tight tracking-tight"
                >
                    {{ book.tenSach }}
                </h1>

                <div class="mb-8 bg-yellow-50 border-2 border-black p-5 shadow-neo-sm relative">
                    <div
                        class="absolute -top-3 -left-2 bg-yellow-300 border-2 border-black px-2 py-0.5 text-xs font-black uppercase"
                    >
                        Giới thiệu
                    </div>
                    <p
                        v-if="book.moTa"
                        class="font-medium text-gray-800 leading-relaxed text-justify"
                    >
                        {{ book.moTa }}
                    </p>
                    <div v-else class="flex items-center gap-2 text-gray-500 italic font-medium">
                        <Info :size="18" /> Chưa có mô tả cho sách này.
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div
                        class="bg-blue-50 border-2 border-black p-3 flex items-center gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all"
                    >
                        <div class="bg-blue-300 border-2 border-black p-2 shrink-0">
                            <User :size="20" class="text-black" stroke-width="2.5" />
                        </div>
                        <div class="overflow-hidden">
                            <span
                                class="block text-[10px] font-black uppercase text-blue-800 mb-0.5"
                                >Tác giả</span
                            >
                            <span
                                class="font-bold text-black truncate block"
                                :title="book.tacGia.map((t) => t.tenTacGia).join(', ')"
                            >
                                {{ book.tacGia.map((t) => t.tenTacGia).join(", ") }}
                            </span>
                        </div>
                    </div>

                    <div
                        class="bg-green-50 border-2 border-black p-3 flex items-center gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all"
                    >
                        <div class="bg-green-300 border-2 border-black p-2 shrink-0">
                            <Building :size="20" class="text-black" stroke-width="2.5" />
                        </div>
                        <div class="overflow-hidden">
                            <span
                                class="block text-[10px] font-black uppercase text-green-800 mb-0.5"
                                >Nhà Xuất Bản</span
                            >
                            <span class="font-bold text-black truncate block">
                                {{ (book.nhaXuatBan as any)?.tenNhaXuatBan || "—" }}
                            </span>
                        </div>
                    </div>

                    <div
                        class="bg-pink-50 border-2 border-black p-3 flex items-center gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all"
                    >
                        <div class="bg-pink-300 border-2 border-black p-2 shrink-0">
                            <Calendar :size="20" class="text-black" stroke-width="2.5" />
                        </div>
                        <div>
                            <span
                                class="block text-[10px] font-black uppercase text-pink-800 mb-0.5"
                                >Năm Xuất Bản</span
                            >
                            <span class="font-bold text-black">{{ book.namXuatBan }}</span>
                        </div>
                    </div>

                    <div
                        class="bg-white border-2 border-black p-3 flex items-center gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <div class="bg-gray-200 border-2 border-black p-2 shrink-0">
                            <Tag :size="20" class="text-black" stroke-width="2.5" />
                        </div>
                        <div class="flex-1 overflow-hidden">
                            <span class="block text-[10px] font-black uppercase text-gray-600 mb-1"
                                >Thể loại</span
                            >
                            <div class="flex flex-wrap gap-1">
                                <span
                                    v-for="dm in book.danhMuc.slice(0, 2)"
                                    :key="dm._id"
                                    class="text-xs font-bold bg-black text-white px-1.5 py-0.5"
                                >
                                    {{ dm.tenDanhMuc }}
                                </span>
                                <span
                                    v-if="book.danhMuc.length > 2"
                                    class="text-xs font-bold text-gray-500"
                                >
                                    +{{ book.danhMuc.length - 2 }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="mt-auto pt-6 border-t-4 border-black flex flex-col sm:flex-row justify-between items-center gap-4"
                >
                    <div
                        class="flex items-center gap-3 bg-white px-4 py-2 border-2 border-black shadow-neo-sm w-full sm:w-auto justify-center sm:justify-start"
                    >
                        <div
                            class="w-4 h-4 rounded-full border-2 border-black"
                            :class="(book.soLuongKhaDung || 0) > 0 ? 'bg-green-500' : 'bg-red-500'"
                        ></div>
                        <div class="flex flex-col">
                            <span class="text-[10px] font-bold uppercase text-gray-500 leading-none"
                                >Tình trạng kho</span
                            >
                            <span class="font-black text-sm uppercase">
                                {{ (book.soLuongKhaDung || 0) > 0 ? "Sẵn sàng" : "Hết hàng" }}
                                <span class="font-mono text-lg ml-1"
                                    >({{ book.soLuongKhaDung }})</span
                                >
                            </span>
                        </div>
                    </div>

                    <NeoButton
                        variant="primary"
                        class="w-full sm:w-auto min-w-[200px] text-lg py-4 flex justify-center"
                        :disabled="(isLoggedIn && (book.soLuongKhaDung || 0) <= 0) || isPending"
                        @click="handleMainAction"
                    >
                        <template v-if="!isLoggedIn">
                            <span class="flex items-center gap-2">
                                <LogIn :size="20" stroke-width="3" /> Đăng nhập để mượn
                            </span>
                        </template>
                        <template v-else>
                            <span class="flex items-center gap-2">
                                <BookOpen v-if="!isPending" :size="20" stroke-width="3" />
                                {{ isPending ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ MƯỢN NGAY" }}
                            </span>
                        </template>
                    </NeoButton>
                </div>
            </div>
        </div>

        <NeoConfirmModal
            v-if="showConfirm"
            title="Xác nhận mượn sách"
            variant="success"
            :processing="isPending"
            @close="showConfirm = false"
            @confirm="handleBorrow"
        >
            <div class="space-y-4">
                <p class="font-medium text-gray-700">Bạn đang đăng ký mượn cuốn sách sau:</p>
                <div
                    class="bg-yellow-100 border-4 border-black p-4 flex gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                    <div
                        class="w-16 h-24 bg-white border-2 border-black flex items-center justify-center shrink-0 overflow-hidden"
                    >
                        <img
                            v-if="book?.hinhAnh"
                            :src="book?.hinhAnh"
                            class="w-full h-full object-cover"
                        />
                        <BookOpen v-else :size="24" class="text-gray-400" />
                    </div>
                    <div>
                        <p class="font-black text-xl uppercase leading-tight line-clamp-2 mb-1">
                            {{ book?.tenSach }}
                        </p>
                        <p class="text-sm font-bold text-gray-600 line-clamp-1 mb-2">
                            {{ book?.tacGia.map((t) => t.tenTacGia).join(", ") }}
                        </p>
                        <span class="text-xs font-mono font-bold bg-black text-white px-2 py-1">
                            {{ book?.maSach }}
                        </span>
                    </div>
                </div>
                <p
                    class="text-sm font-bold text-gray-500 italic mt-2 border-t-2 border-dashed border-gray-300 pt-2"
                >
                    * Vui lòng đến thư viện nhận sách sau khi yêu cầu được duyệt.
                </p>
            </div>
        </NeoConfirmModal>
    </div>
</template>
