<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Loader2 } from "lucide-vue-next";
import BaseModal from "@/components/common/BaseModal.vue";
import NeoButton from "@/components/ui/NeoButton.vue";
import NeoInput from "@/components/ui/NeoInput.vue";
import NeoSelect from "@/components/ui/NeoSelect.vue";
import NeoMultiSelect from "@/components/ui/NeoMultiSelect.vue";
import { useCreateBook, useUpdateBook } from "@/features/books/mutations";
import { useAuthors, usePublishers, useCategories } from "@/features/resources/queries";
import { useToast } from "@/composables/useToast";
import type { Sach } from "@/types/models/Sach";

const props = defineProps<{
    book?: Sach;
}>();

const emit = defineEmits<{
    (e: "close"): void;
    (e: "success"): void;
}>();

const { mutate: createBook, isPending: isCreating } = useCreateBook();
const { mutate: updateBook, isPending: isUpdating } = useUpdateBook();
const { addToast } = useToast();

// Fetch Resources
const { data: authors } = useAuthors();
const { data: publishers } = usePublishers();
const { data: categories } = useCategories();

// Transform to Options
const authorOptions = computed(
    () => authors.value?.map((a) => ({ value: a._id, label: a.tenTacGia })) || [],
);
const publisherOptions = computed(
    () => publishers.value?.map((p) => ({ value: p._id, label: p.tenNhaXuatBan })) || [],
);
const categoryOptions = computed(
    () => categories.value?.map((c) => ({ value: c._id, label: c.tenDanhMuc })) || [],
);

const isEditMode = computed<boolean>(() => !!props.book);
const isPending = computed<boolean>(() => isCreating.value || isUpdating.value);

const formData = ref({
    tenSach: "",
    namXuatBan: new Date().getFullYear(),
    hinhAnh: "",
    moTa: "",
    tacGiaIds: [] as string[],
    nhaXuatBanId: "",
    danhMucIds: [] as string[],
});

// Init Form
watch(
    () => props.book,
    (newBook) => {
        if (newBook) {
            formData.value = {
                tenSach: newBook.tenSach,
                namXuatBan: newBook.namXuatBan,
                hinhAnh: newBook.hinhAnh || "",
                moTa: newBook.moTa || "",
                tacGiaIds: newBook.tacGia.map((t) => t._id),
                nhaXuatBanId:
                    typeof newBook.nhaXuatBan === "object" && newBook.nhaXuatBan
                        ? newBook.nhaXuatBan._id
                        : String(newBook.nhaXuatBan || ""),
                danhMucIds: newBook.danhMuc.map((d) => d._id),
            };
        } else {
            // Reset
            formData.value = {
                tenSach: "",
                namXuatBan: new Date().getFullYear(),
                hinhAnh: "",
                moTa: "",
                tacGiaIds: [],
                nhaXuatBanId: "",
                danhMucIds: [],
            };
        }
    },
    { immediate: true },
);

const handleSubmit = () => {
    // Transform to Payload
    const payload = {
        tenSach: formData.value.tenSach,
        namXuatBan: Number(formData.value.namXuatBan),
        hinhAnh: formData.value.hinhAnh,
        moTa: formData.value.moTa,
        tacGia: formData.value.tacGiaIds,
        nhaXuatBan: formData.value.nhaXuatBanId,
        danhMuc: formData.value.danhMucIds,
    };

    if (isEditMode.value && props.book) {
        updateBook(
            { id: props.book._id, payload },
            {
                onSuccess: () => {
                    addToast({
                        title: "Thành công",
                        description: `Đã cập nhật sách "${payload.tenSach}"`,
                        variant: "success",
                    });
                    emit("success");
                },
                onError: (err) => {
                    addToast({
                        title: "Lỗi",
                        description: err.message || "Cập nhật thất bại.",
                        variant: "error",
                    });
                },
            },
        );
    } else {
        createBook(payload, {
            onSuccess: () => {
                addToast({
                    title: "Thành công",
                    description: `Đã thêm sách "${payload.tenSach}"`,
                    variant: "success",
                });
                emit("success");
            },
            onError: (err) => {
                addToast({
                    title: "Lỗi",
                    description: err.message || "Thêm mới thất bại.",
                    variant: "error",
                });
            },
        });
    }
};
</script>

<template>
    <BaseModal
        :isOpen="true"
        :title="isEditMode ? `Chỉnh Sửa: ${book?.maSach}` : 'Thêm Sách Mới'"
        @close="$emit('close')"
    >
        <form @submit.prevent="handleSubmit" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NeoInput
                    id="tenSach"
                    label="Tên Sách"
                    v-model="formData.tenSach"
                    placeholder="Nhập tên sách..."
                />
                <NeoInput
                    id="namXB"
                    label="Năm Xuất Bản"
                    type="number"
                    v-model="formData.namXuatBan"
                />
            </div>

            <NeoInput
                id="hinhAnh"
                label="Link Hình Ảnh (URL)"
                v-model="formData.hinhAnh"
                placeholder="https://example.com/image.jpg"
            />

            <div class="space-y-4 border-2 border-dashed border-gray-300 p-4 bg-gray-50">
                <NeoMultiSelect
                    id="tacGia"
                    label="Tác Giả"
                    :options="authorOptions"
                    v-model="formData.tacGiaIds"
                    placeholder="Chọn tác giả..."
                />

                <NeoSelect
                    id="nhaXuatBan"
                    label="Nhà Xuất Bản"
                    :options="publisherOptions"
                    v-model="formData.nhaXuatBanId"
                    placeholder="Chọn nhà xuất bản..."
                />

                <NeoMultiSelect
                    id="theLoai"
                    label="Thể Loại / Danh Mục"
                    :options="categoryOptions"
                    v-model="formData.danhMucIds"
                    placeholder="Chọn thể loại..."
                />
            </div>

            <div class="flex flex-col gap-1">
                <label for="moTa" class="font-bold text-sm ml-1">Mô Tả</label>
                <textarea
                    id="moTa"
                    v-model="formData.moTa"
                    rows="4"
                    class="w-full p-3 border-2 border-black outline-none transition-all focus:shadow-neo-sm placeholder:text-gray-500 font-body resize-y"
                    placeholder="Tóm tắt nội dung sách..."
                ></textarea>
            </div>

            <div class="pt-4 flex justify-end gap-3 border-t-2 border-black">
                <NeoButton
                    type="button"
                    variant="secondary"
                    @click="$emit('close')"
                    :disabled="isPending"
                >
                    Hủy bỏ
                </NeoButton>

                <NeoButton type="submit" class="min-w-[140px]" :disabled="isPending">
                    <span v-if="isPending" class="flex items-center gap-2">
                        <Loader2 class="animate-spin" :size="18" /> Đang lưu...
                    </span>
                    <span v-else>
                        {{ isEditMode ? "Lưu Thay Đổi" : "Tạo Sách Mới" }}
                    </span>
                </NeoButton>
            </div>
        </form>
    </BaseModal>
</template>
