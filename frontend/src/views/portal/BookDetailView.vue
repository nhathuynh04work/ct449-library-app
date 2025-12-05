<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, User, Tag, BookOpen, Calendar, LogIn } from "lucide-vue-next";
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
        onError: (err: Error) => {
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
    <div class="w-full max-w-4xl mx-auto space-y-6">
        <button @click="router.back()" class="flex items-center gap-2 font-bold hover:underline">
            <ArrowLeft :size="20" /> Quay lại danh sách
        </button>

        <div v-if="isLoading" class="text-center py-20 text-xl font-bold">
            Đang tải thông tin sách...
        </div>
        <div v-else-if="isError || !book" class="text-center py-20 text-red-500 font-bold">
            Không tìm thấy sách.
        </div>

        <div
            v-else
            class="bg-white border-4 border-black shadow-neo grid grid-cols-1 md:grid-cols-3"
        >
            <div
                class="md:col-span-1 border-b-4 md:border-b-0 md:border-r-4 border-black min-h-[300px] flex items-center justify-center relative overflow-hidden"
                :class="getRandomColor(book._id)"
            >
                <BookOpen :size="80" class="text-black/20" />
                <div
                    class="absolute bottom-4 left-4 bg-white border-2 border-black px-3 py-1 font-mono font-bold text-sm shadow-neo-sm"
                >
                    {{ book.maSach }}
                </div>
            </div>

            <div class="md:col-span-2 p-8 flex flex-col">
                <h1 class="text-4xl font-black font-display uppercase mb-4 leading-tight">
                    {{ book.tenSach }}
                </h1>

                <div class="space-y-4 mb-8 flex-1">
                    <div class="flex items-start gap-3">
                        <User :size="20" class="shrink-0 mt-1" />
                        <div>
                            <span class="font-bold block text-sm text-gray-500 uppercase"
                                >Tác giả</span
                            >
                            <span class="text-lg font-medium">{{
                                book.tacGia.map((t) => t.tenTacGia).join(", ")
                            }}</span>
                        </div>
                    </div>

                    <div class="flex items-start gap-3">
                        <Tag :size="20" class="shrink-0 mt-1" />
                        <div>
                            <span class="font-bold block text-sm text-gray-500 uppercase"
                                >Thể loại</span
                            >
                            <div class="flex gap-2 mt-1">
                                <span
                                    v-for="dm in book.danhMuc"
                                    :key="dm._id"
                                    class="bg-gray-100 border border-black px-2 py-0.5 text-xs font-bold"
                                >
                                    {{ dm.tenDanhMuc }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-start gap-3">
                        <Calendar :size="20" class="shrink-0 mt-1" />
                        <div>
                            <span class="font-bold block text-sm text-gray-500 uppercase"
                                >Năm xuất bản</span
                            >
                            <span class="text-lg font-medium">{{ book.namXuatBan }}</span>
                        </div>
                    </div>
                </div>

                <div
                    class="pt-6 border-t-2 border-black border-dashed flex justify-between items-center"
                >
                    <div class="flex items-center gap-2">
                        <template v-if="isLoggedIn">
                            <div
                                class="w-3 h-3 rounded-full"
                                :class="
                                    (book.soLuongBanSao || 0) > 0 ? 'bg-green-500' : 'bg-red-500'
                                "
                            ></div>
                            <span class="font-bold text-sm">
                                {{
                                    (book.soLuongBanSao || 0) > 0
                                        ? "Có sẵn tại thư viện"
                                        : "Tạm hết hàng"
                                }}
                            </span>
                        </template>
                        <span v-else class="text-gray-400 font-bold text-sm italic">
                            Bạn chưa đăng nhập
                        </span>
                    </div>

                    <NeoButton
                        variant="primary"
                        :disabled="(isLoggedIn && (book.soLuongBanSao || 0) <= 0) || isPending"
                        @click="handleMainAction"
                    >
                        <template v-if="!isLoggedIn">
                            <span class="flex items-center gap-2">
                                <LogIn :size="18" /> Đăng nhập để mượn
                            </span>
                        </template>
                        <template v-else>
                            {{ isPending ? "Đang xử lý..." : "Đăng Ký Mượn" }}
                        </template>
                    </NeoButton>
                </div>
            </div>
        </div>

        <NeoConfirmModal
            v-if="showConfirm"
            title="Xác nhận mượn sách"
            :description="`Bạn có chắc chắn muốn đăng ký mượn cuốn '${book?.tenSach}' không?`"
            variant="info"
            @close="showConfirm = false"
            @confirm="handleBorrow"
        />
    </div>
</template>
