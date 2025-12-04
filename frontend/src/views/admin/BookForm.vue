<script setup lang="ts">
import { ref, computed } from "vue";
import { X, Save, Loader2 } from "lucide-vue-next";
import NeoInput from "@/components/ui/NeoInput.vue";
import NeoSelect from "@/components/ui/NeoSelect.vue";
import NeoMultiSelect from "@/components/ui/NeoMultiSelect.vue";
import NeoButton from "@/components/ui/NeoButton.vue";
import { useAuthors, useCategories, usePublishers } from "@/features/resources/queries";
import { useCreateBook } from "@/features/books/mutations";
import { useToast } from "@/composables/useToast";

const emit = defineEmits(["close", "success"]);
const { addToast } = useToast();

// Queries
const { data: authors } = useAuthors();
const { data: publishers } = usePublishers();
const { data: categories } = useCategories();
const { mutate: createBook, isPending } = useCreateBook();

// Options mapping
const authorOptions = computed(
    () => authors.value?.map((a) => ({ value: a._id, label: a.tenTacGia })) || [],
);
const publisherOptions = computed(
    () => publishers.value?.map((p) => ({ value: p._id, label: p.tenNhaXuatBan })) || [],
);
const categoryOptions = computed(
    () => categories.value?.map((c) => ({ value: c._id, label: c.tenDanhMuc })) || [],
);

// Form State
const form = ref({
    tenSach: "",
    namXuatBan: new Date().getFullYear(),
    nhaXuatBan: "",
    tacGia: [] as string[],
    danhMuc: [] as string[],
});

const handleSubmit = () => {
    if (!form.value.tenSach || !form.value.nhaXuatBan || form.value.tacGia.length === 0) {
        addToast({
            title: "Thiếu thông tin",
            description: "Vui lòng điền đầy đủ các trường bắt buộc.",
            variant: "warning",
        });
        return;
    }

    createBook(
        {
            ...form.value,
            namXuatBan: Number(form.value.namXuatBan),
        },
        {
            onSuccess: () => {
                addToast({
                    title: "Thành công",
                    description: "Đã thêm sách mới.",
                    variant: "success",
                });
                emit("success");
                emit("close");
            },
            onError: (err: any) => {
                addToast({
                    title: "Lỗi",
                    description: err.message || "Không thể thêm sách.",
                    variant: "error",
                });
            },
        },
    );
};
</script>

<template>
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="$emit('close')"
    >
        <div class="bg-white border-4 border-black shadow-neo w-full max-w-2xl relative animate-in">
            <div
                class="bg-yellow-300 p-4 border-b-4 border-black flex justify-between items-center"
            >
                <h2 class="text-xl font-black uppercase font-display">Thêm Sách Mới</h2>
                <button
                    @click="$emit('close')"
                    class="hover:bg-white/50 p-1 border-2 border-transparent hover:border-black transition-all"
                >
                    <X :size="24" />
                </button>
            </div>

            <form @submit.prevent="handleSubmit" class="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                <div class="space-y-4">
                    <NeoInput
                        id="tenSach"
                        label="Tên Sách"
                        v-model="form.tenSach"
                        placeholder="Nhập tên sách..."
                    />

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <NeoInput
                            id="namXuatBan"
                            label="Năm Xuất Bản"
                            type="number"
                            v-model="form.namXuatBan"
                        />

                        <NeoSelect
                            id="nhaXuatBan"
                            label="Nhà Xuất Bản"
                            v-model="form.nhaXuatBan"
                            :options="publisherOptions"
                            placeholder="Chọn NXB..."
                        />
                    </div>

                    <NeoMultiSelect
                        id="tacGia"
                        label="Tác Giả"
                        v-model="form.tacGia"
                        :options="authorOptions"
                        placeholder="Chọn một hoặc nhiều tác giả..."
                    />

                    <NeoMultiSelect
                        id="danhMuc"
                        label="Danh Mục"
                        v-model="form.danhMuc"
                        :options="categoryOptions"
                        placeholder="Chọn thể loại..."
                    />
                </div>
            </form>

            <div class="p-4 border-t-4 border-black bg-gray-50 flex justify-end gap-3">
                <button
                    @click="$emit('close')"
                    class="px-4 py-2 font-bold border-2 border-transparent hover:underline"
                >
                    Hủy bỏ
                </button>
                <NeoButton
                    @click="handleSubmit"
                    variant="primary"
                    :disabled="isPending"
                    class="flex items-center gap-2"
                >
                    <Loader2 v-if="isPending" :size="20" class="animate-spin" />
                    <Save v-else :size="20" />
                    Lưu Sách
                </NeoButton>
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
