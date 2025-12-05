<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Loader2 } from "lucide-vue-next";
import BaseModal from "@/components/common/BaseModal.vue";
import NeoButton from "@/components/ui/NeoButton.vue";
import { useCreateBook, useUpdateBook } from "@/features/books/mutations";
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

const isEditMode = computed<boolean>(() => !!props.book);
const isPending = computed<boolean>(() => isCreating.value || isUpdating.value);

const formData = ref({
    maSach: "",
    tenSach: "",
    namXuatBan: new Date().getFullYear(),
    soLuongBanSao: 0,
    tacGiaIds: [],
    nhaXuatBanId: "",
    danhMucIds: [],
});

const initForm = () => {
    if (props.book) {
        formData.value = {
            maSach: props.book.maSach,
            tenSach: props.book.tenSach,
            namXuatBan: props.book.namXuatBan,
            soLuongBanSao: props.book.soLuongBanSao || 0,

            tacGiaIds: props.book.tacGia.map((t) => t._id),
            nhaXuatBanId: props.book.nhaXuatBan?._id || "",
            danhMucIds: props.book.danhMuc.map((d) => d._id),
        };
    } else {
        formData.value = {
            maSach: "",
            tenSach: "",
            namXuatBan: new Date().getFullYear(),
            soLuongBanSao: 0,
            tacGiaIds: [],
            nhaXuatBanId: "",
            danhMucIds: [],
        };
    }
};

watch(() => props.book, initForm, { immediate: true });

const handleSubmit = () => {
    if (isEditMode.value && props.book) {
        updateBook(
            { id: props.book._id, data: formData.value },
            {
                onSuccess: () => {
                    addToast({
                        title: "Cập nhật thành công",
                        description: `Đã cập nhật thông tin sách "${formData.value.tenSach}"`,
                        variant: "success",
                    });
                    emit("success");
                },
                onError: (err: Error) => {
                    addToast({
                        title: "Lỗi cập nhật",
                        description: err.message || "Có lỗi xảy ra.",
                        variant: "error",
                    });
                },
            },
        );
    } else {
        createBook(formData.value, {
            onSuccess: () => {
                addToast({
                    title: "Thêm mới thành công",
                    description: `Đã thêm sách "${formData.value.tenSach}" vào hệ thống.`,
                    variant: "success",
                });
                emit("success");
            },
            onError: (err: Error) => {
                addToast({
                    title: "Lỗi thêm mới",
                    description: err.message || "Có lỗi xảy ra.",
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
        :title="isEditMode ? 'Chỉnh Sửa Thông Tin Sách' : 'Thêm Sách Mới'"
        @close="$emit('close')"
    >
        <form @submit.prevent="handleSubmit" class="space-y-5">
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="block text-sm font-black uppercase">Mã Sách</label>
                    <input
                        v-model="formData.maSach"
                        type="text"
                        :disabled="isEditMode"
                        class="w-full p-2.5 bg-gray-50 border-2 border-black focus:shadow-neo-sm outline-none transition-all disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                        placeholder="VD: S001"
                        required
                    />
                    <p v-if="isEditMode" class="text-xs text-gray-500 font-bold">
                        * Mã sách không thể thay đổi
                    </p>
                </div>

                <div class="space-y-1">
                    <label class="block text-sm font-black uppercase">Năm Xuất Bản</label>
                    <input
                        v-model="formData.namXuatBan"
                        type="number"
                        class="w-full p-2.5 bg-white border-2 border-black focus:shadow-neo-sm outline-none transition-all"
                        required
                    />
                </div>
            </div>

            <div class="space-y-1">
                <label class="block text-sm font-black uppercase">Tên Sách</label>
                <input
                    v-model="formData.tenSach"
                    type="text"
                    class="w-full p-2.5 bg-white border-2 border-black focus:shadow-neo-sm outline-none transition-all"
                    placeholder="Nhập tên sách đầy đủ..."
                    required
                />
            </div>

            <div
                class="p-4 bg-yellow-50 border-2 border-dashed border-black text-sm font-bold text-gray-600"
            >
                <p>⚠️ Chức năng chọn Tác Giả & NXB đang phát triển</p>
                <p class="text-xs font-normal mt-1 text-gray-500">
                    Dữ liệu hiện tại: {{ formData.tacGiaIds.length }} tác giả,
                    {{ formData.danhMucIds.length }} danh mục.
                </p>
            </div>

            <div class="pt-6 flex justify-end gap-3 border-t-2 border-black mt-4">
                <NeoButton
                    type="button"
                    variant="secondary"
                    @click="$emit('close')"
                    :disabled="isPending"
                >
                    Hủy bỏ
                </NeoButton>

                <NeoButton type="submit" class="min-w-[120px]" :disabled="isPending">
                    <span v-if="isPending" class="flex items-center gap-2">
                        <Loader2 class="animate-spin" :size="16" /> Đang lưu...
                    </span>
                    <span v-else>
                        {{ isEditMode ? "Cập Nhật" : "Lưu Sách Mới" }}
                    </span>
                </NeoButton>
            </div>
        </form>
    </BaseModal>
</template>
