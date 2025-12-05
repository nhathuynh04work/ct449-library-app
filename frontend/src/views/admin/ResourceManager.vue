<script setup lang="ts">
import { ref, computed } from "vue";
import {
    Users,
    Building,
    Tag,
    Plus,
    Trash2,
    Loader2,
    Search,
    BookOpen,
    Edit,
} from "lucide-vue-next";
import NeoButton from "@/components/ui/NeoButton.vue";
import NeoInput from "@/components/ui/NeoInput.vue";
import BaseModal from "@/components/common/BaseModal.vue";
import NeoConfirmModal from "@/components/ui/NeoConfirmModal.vue";
import { useAuthors, usePublishers, useCategories } from "@/features/resources/queries";
import {
    useCreateAuthor,
    useUpdateAuthor,
    useDeleteAuthor,
    useCreatePublisher,
    useUpdatePublisher,
    useDeletePublisher,
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory,
} from "@/features/resources/mutations";
import { useToast } from "@/composables/useToast";
import type { TacGia } from "@/types/models/TacGia";
import type { NhaXuatBan } from "@/types/models/NhaXuatBan";
import type { DanhMuc } from "@/types/models/DanhMuc";

type Tab = "AUTHORS" | "PUBLISHERS" | "CATEGORIES";
const activeTab = ref<Tab>("AUTHORS");
const searchQuery = ref("");
const { addToast } = useToast();

const { data: authors, isLoading: l1 } = useAuthors();
const { data: publishers, isLoading: l2 } = usePublishers();
const { data: categories, isLoading: l3 } = useCategories();

const createAuthor = useCreateAuthor();
const updateAuthor = useUpdateAuthor();
const deleteAuthor = useDeleteAuthor();

const createPublisher = useCreatePublisher();
const updatePublisher = useUpdatePublisher();
const deletePublisher = useDeletePublisher();

const createCategory = useCreateCategory();
const updateCategory = useUpdateCategory();
const deleteCategory = useDeleteCategory();

const showModal = ref(false);
const isEditMode = ref(false);
const editingId = ref<string | null>(null);
const deleteId = ref<string | null>(null);

const formData = ref({
    name: "",
    extra: "",
});

const isLoading = computed(() => l1.value || l2.value || l3.value);
const isSubmitting = computed(() =>
    [
        createAuthor,
        updateAuthor,
        createPublisher,
        updatePublisher,
        createCategory,
        updateCategory,
    ].some((m) => m.isPending.value),
);

const filteredAuthors = computed(() =>
    (authors.value || []).filter((a) =>
        a.tenTacGia.toLowerCase().includes(searchQuery.value.toLowerCase()),
    ),
);

const filteredPublishers = computed(() =>
    (publishers.value || []).filter((p) =>
        p.tenNhaXuatBan.toLowerCase().includes(searchQuery.value.toLowerCase()),
    ),
);

const filteredCategories = computed(() =>
    (categories.value || []).filter((c) =>
        c.tenDanhMuc.toLowerCase().includes(searchQuery.value.toLowerCase()),
    ),
);

const handleOpenCreate = () => {
    isEditMode.value = false;
    editingId.value = null;
    formData.value = { name: "", extra: "" };
    showModal.value = true;
};

const handleOpenEdit = (item: TacGia | NhaXuatBan | DanhMuc) => {
    isEditMode.value = true;
    editingId.value = item._id;

    if (activeTab.value === "AUTHORS") {
        const author = item as TacGia;
        formData.value = { name: author.tenTacGia, extra: author.tieuSu || "" };
    } else if (activeTab.value === "PUBLISHERS") {
        const publisher = item as NhaXuatBan;
        formData.value = { name: publisher.tenNhaXuatBan, extra: publisher.diaChi || "" };
    } else {
        const category = item as DanhMuc;
        formData.value = { name: category.tenDanhMuc, extra: "" };
    }
    showModal.value = true;
};

const handleSubmit = () => {
    if (!formData.value.name.trim()) return;

    const onSuccess = () => {
        addToast({
            title: isEditMode.value ? "Cập nhật thành công" : "Tạo mới thành công",
            variant: "success",
        });
        showModal.value = false;
    };

    const onError = () => {
        addToast({
            title: "Lỗi",
            description: "Không thể thực hiện thao tác.",
            variant: "error",
        });
    };

    if (activeTab.value === "AUTHORS") {
        if (isEditMode.value && editingId.value) {
            updateAuthor.mutate(
                {
                    id: editingId.value,
                    payload: { tenTacGia: formData.value.name, tieuSu: formData.value.extra },
                },
                { onSuccess, onError },
            );
        } else {
            createAuthor.mutate(
                { tenTacGia: formData.value.name, tieuSu: formData.value.extra },
                { onSuccess, onError },
            );
        }
    } else if (activeTab.value === "PUBLISHERS") {
        if (isEditMode.value && editingId.value) {
            updatePublisher.mutate(
                {
                    id: editingId.value,
                    payload: {
                        tenNhaXuatBan: formData.value.name,
                        diaChi: formData.value.extra || "Chưa cập nhật",
                    },
                },
                { onSuccess, onError },
            );
        } else {
            createPublisher.mutate(
                {
                    tenNhaXuatBan: formData.value.name,
                    diaChi: formData.value.extra || "Chưa cập nhật",
                },
                { onSuccess, onError },
            );
        }
    } else {
        if (isEditMode.value && editingId.value) {
            updateCategory.mutate(
                { id: editingId.value, payload: { tenDanhMuc: formData.value.name } },
                { onSuccess, onError },
            );
        } else {
            createCategory.mutate({ tenDanhMuc: formData.value.name }, { onSuccess, onError });
        }
    }
};

const confirmDelete = () => {
    if (!deleteId.value) return;

    const onSuccess = () => {
        addToast({ title: "Đã xóa", variant: "info" });
        deleteId.value = null;
    };

    if (activeTab.value === "AUTHORS") deleteAuthor.mutate(deleteId.value, { onSuccess });
    else if (activeTab.value === "PUBLISHERS")
        deletePublisher.mutate(deleteId.value, { onSuccess });
    else deleteCategory.mutate(deleteId.value, { onSuccess });
};

const getThemeColor = (type: "bg" | "border" | "hover") => {
    const map = {
        AUTHORS: { bg: "bg-yellow-300", border: "border-yellow-300", hover: "hover:bg-yellow-300" },
        PUBLISHERS: { bg: "bg-blue-300", border: "border-blue-300", hover: "hover:bg-blue-300" },
        CATEGORIES: { bg: "bg-green-300", border: "border-green-300", hover: "hover:bg-green-300" },
    };
    return map[activeTab.value][type];
};

const getModalTitle = computed(() => {
    const action = isEditMode.value ? "Chỉnh sửa" : "Thêm";
    switch (activeTab.value) {
        case "AUTHORS":
            return `${action} Tác Giả`;
        case "PUBLISHERS":
            return `${action} Nhà Xuất Bản`;
        case "CATEGORIES":
            return `${action} Danh Mục`;
        default:
            return `${action} Mới`;
    }
});

// Helper to generate precise classes for tabs
const getTabButtonClass = (tabName: Tab) => {
    const isActive = activeTab.value === tabName;
    const base =
        "px-6 py-3 font-black uppercase transition-all flex items-center gap-2 border-4 border-black relative -bottom-2 whitespace-nowrap";

    // Inactive: White bg, shadow, move on hover
    const inactive =
        "bg-white hover:translate-y-[-2px] active:translate-y-[0px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none";

    // Active: Colored bg, no shadow, lifted up, z-index to cover border
    let activeColor = "";
    if (tabName === "AUTHORS") activeColor = "bg-yellow-300";
    else if (tabName === "PUBLISHERS") activeColor = "bg-blue-300";
    else if (tabName === "CATEGORIES") activeColor = "bg-green-300";

    const active = `${activeColor} translate-y-[-2px] shadow-none z-10`;

    return isActive ? `${base} ${active}` : `${base} ${inactive}`;
};
</script>

<template>
    <div class="space-y-8">
        <div class="flex gap-4 border-b-4 border-black pb-1 overflow-x-auto">
            <button
                @click="
                    activeTab = 'AUTHORS';
                    searchQuery = '';
                "
                :class="getTabButtonClass('AUTHORS')"
            >
                <Users :size="20" stroke-width="3" /> Tác Giả
            </button>
            <button
                @click="
                    activeTab = 'PUBLISHERS';
                    searchQuery = '';
                "
                :class="getTabButtonClass('PUBLISHERS')"
            >
                <Building :size="20" stroke-width="3" /> Nhà Xuất Bản
            </button>
            <button
                @click="
                    activeTab = 'CATEGORIES';
                    searchQuery = '';
                "
                :class="getTabButtonClass('CATEGORIES')"
            >
                <Tag :size="20" stroke-width="3" /> Danh Mục
            </button>
        </div>

        <div
            class="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 border-4 border-black shadow-neo"
        >
            <div class="relative w-full md:w-96">
                <Search class="absolute left-3 top-3.5 text-black" :size="20" stroke-width="3" />
                <input
                    v-model="searchQuery"
                    type="text"
                    :placeholder="`Tìm kiếm...`"
                    class="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-black font-bold outline-none focus:shadow-neo-sm transition-all placeholder:text-gray-400 placeholder:font-normal"
                />
            </div>

            <NeoButton
                @click="handleOpenCreate"
                class="w-full md:w-auto flex items-center justify-center gap-2"
                variant="primary"
            >
                <Plus :size="20" stroke-width="4" /> Thêm Mới
            </NeoButton>
        </div>

        <div class="bg-white border-4 border-black shadow-neo min-h-[400px] relative">
            <div
                v-if="isLoading"
                class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 backdrop-blur-sm"
            >
                <Loader2 :size="48" class="animate-spin text-black mb-4" />
                <p class="font-black text-xl uppercase">Đang tải dữ liệu...</p>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b-4 border-black text-black" :class="getThemeColor('bg')">
                            <th
                                class="p-4 border-r-2 border-black font-black uppercase tracking-wide w-16 text-center"
                            >
                                #
                            </th>
                            <th
                                class="p-4 border-r-2 border-black font-black uppercase tracking-wide w-1/3"
                            >
                                {{
                                    activeTab === "AUTHORS"
                                        ? "Tên Tác Giả"
                                        : activeTab === "PUBLISHERS"
                                          ? "Tên Nhà Xuất Bản"
                                          : "Tên Danh Mục"
                                }}
                            </th>
                            <th
                                v-if="activeTab !== 'CATEGORIES'"
                                class="p-4 border-r-2 border-black font-black uppercase tracking-wide"
                            >
                                {{ activeTab === "AUTHORS" ? "Tiểu Sử" : "Địa Chỉ" }}
                            </th>
                            <th
                                class="p-4 border-r-2 border-black font-black uppercase tracking-wide w-28 text-center"
                            >
                                Số sách
                            </th>
                            <th class="p-4 font-black uppercase tracking-wide w-40 text-center">
                                Thao tác
                            </th>
                        </tr>
                    </thead>

                    <tbody v-if="activeTab === 'AUTHORS'" class="divide-y-2 divide-black">
                        <tr
                            v-for="(item, index) in filteredAuthors"
                            :key="item._id"
                            class="hover:bg-yellow-50 transition-colors group"
                        >
                            <td class="p-4 border-r-2 border-black text-center font-bold">
                                {{ index + 1 }}
                            </td>
                            <td class="p-4 border-r-2 border-black font-bold text-lg">
                                {{ item.tenTacGia }}
                            </td>
                            <td class="p-4 border-r-2 border-black font-medium text-gray-600">
                                <span class="line-clamp-2">{{ item.tieuSu || "—" }}</span>
                            </td>
                            <td class="p-4 border-r-2 border-black text-center">
                                <div
                                    class="flex items-center justify-center gap-1 font-black text-lg bg-white border-2 border-black py-1 px-2 shadow-sm inline-flex"
                                >
                                    <BookOpen :size="16" /> {{ item.soLuongSach || 0 }}
                                </div>
                            </td>
                            <td class="p-4 text-center">
                                <div class="flex items-center justify-center gap-2">
                                    <button
                                        @click="handleOpenEdit(item)"
                                        class="p-2 bg-white border-2 border-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all active:bg-gray-100"
                                    >
                                        <Edit :size="18" />
                                    </button>
                                    <button
                                        @click="deleteId = item._id"
                                        class="p-2 bg-red-400 border-2 border-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all active:bg-red-500"
                                    >
                                        <Trash2 :size="18" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>

                    <tbody v-if="activeTab === 'PUBLISHERS'" class="divide-y-2 divide-black">
                        <tr
                            v-for="(item, index) in filteredPublishers"
                            :key="item._id"
                            class="hover:bg-blue-50 transition-colors group"
                        >
                            <td class="p-4 border-r-2 border-black text-center font-bold">
                                {{ index + 1 }}
                            </td>
                            <td class="p-4 border-r-2 border-black font-bold text-lg">
                                {{ item.tenNhaXuatBan }}
                            </td>
                            <td class="p-4 border-r-2 border-black font-medium text-gray-600">
                                {{ item.diaChi }}
                            </td>
                            <td class="p-4 border-r-2 border-black text-center">
                                <div
                                    class="flex items-center justify-center gap-1 font-black text-lg bg-white border-2 border-black py-1 px-2 shadow-sm inline-flex"
                                >
                                    <BookOpen :size="16" /> {{ item.soLuongSach || 0 }}
                                </div>
                            </td>
                            <td class="p-4 text-center">
                                <div class="flex items-center justify-center gap-2">
                                    <button
                                        @click="handleOpenEdit(item)"
                                        class="p-2 bg-white border-2 border-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all active:bg-gray-100"
                                    >
                                        <Edit :size="18" />
                                    </button>
                                    <button
                                        @click="deleteId = item._id"
                                        class="p-2 bg-red-400 border-2 border-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all active:bg-red-500"
                                    >
                                        <Trash2 :size="18" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>

                    <tbody v-if="activeTab === 'CATEGORIES'" class="divide-y-2 divide-black">
                        <tr
                            v-for="(item, index) in filteredCategories"
                            :key="item._id"
                            class="hover:bg-green-50 transition-colors group"
                        >
                            <td class="p-4 border-r-2 border-black text-center font-bold">
                                {{ index + 1 }}
                            </td>
                            <td class="p-4 border-r-2 border-black font-bold text-lg">
                                <span
                                    class="bg-white border-2 border-black px-3 py-1 shadow-neo-sm inline-block"
                                >
                                    {{ item.tenDanhMuc }}
                                </span>
                            </td>
                            <td class="p-4 border-r-2 border-black text-center">
                                <div
                                    class="flex items-center justify-center gap-1 font-black text-lg bg-white border-2 border-black py-1 px-2 shadow-sm inline-flex"
                                >
                                    <BookOpen :size="16" /> {{ item.soLuongSach || 0 }}
                                </div>
                            </td>
                            <td class="p-4 text-center">
                                <div class="flex items-center justify-center gap-2">
                                    <button
                                        @click="handleOpenEdit(item)"
                                        class="p-2 bg-white border-2 border-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all active:bg-gray-100"
                                    >
                                        <Edit :size="18" />
                                    </button>
                                    <button
                                        @click="deleteId = item._id"
                                        class="p-2 bg-red-400 border-2 border-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all active:bg-red-500"
                                    >
                                        <Trash2 :size="18" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <BaseModal
            :isOpen="showModal"
            :title="getModalTitle"
            :headerClass="getThemeColor('bg')"
            @close="showModal = false"
        >
            <div class="space-y-5">
                <NeoInput
                    id="name"
                    :label="
                        activeTab === 'AUTHORS'
                            ? 'Họ và Tên'
                            : activeTab === 'PUBLISHERS'
                              ? 'Tên Nhà Xuất Bản'
                              : 'Tên Danh Mục'
                    "
                    v-model="formData.name"
                    placeholder="Nhập nội dung..."
                />

                <div v-if="activeTab === 'AUTHORS'" class="flex flex-col gap-1">
                    <label for="bio" class="font-bold text-sm ml-1">Tiểu sử</label>
                    <textarea
                        id="bio"
                        v-model="formData.extra"
                        rows="3"
                        class="w-full p-3 border-2 border-black outline-none transition-all focus:shadow-neo-sm placeholder:text-gray-500 font-body resize-none"
                        placeholder="Vài nét về tác giả..."
                    ></textarea>
                </div>

                <NeoInput
                    v-if="activeTab === 'PUBLISHERS'"
                    id="address"
                    label="Địa chỉ"
                    v-model="formData.extra"
                    placeholder="Số nhà, tên đường, thành phố..."
                />

                <div class="flex justify-end pt-4 border-t-2 border-black gap-3 mt-6">
                    <NeoButton type="button" variant="secondary" @click="showModal = false">
                        Hủy
                    </NeoButton>
                    <NeoButton @click="handleSubmit" :disabled="isSubmitting" class="min-w-[120px]">
                        <span v-if="isSubmitting">Đang lưu...</span>
                        <span v-else>{{ isEditMode ? "Lưu thay đổi" : "Xác nhận thêm" }}</span>
                    </NeoButton>
                </div>
            </div>
        </BaseModal>

        <NeoConfirmModal
            v-if="deleteId"
            title="Xóa Dữ Liệu"
            description="Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác và có thể ảnh hưởng đến các sách liên quan."
            variant="danger"
            @close="deleteId = null"
            @confirm="confirmDelete"
        />
    </div>
</template>
