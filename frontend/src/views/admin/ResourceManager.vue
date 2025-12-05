<script setup lang="ts">
import { ref, computed } from "vue";
import { Users, Building, Tag, Plus, Trash2, Loader2, Search, BookOpen } from "lucide-vue-next";
import NeoButton from "@/components/ui/NeoButton.vue";
import NeoInput from "@/components/ui/NeoInput.vue";
import BaseModal from "@/components/common/BaseModal.vue";
import { useAuthors, usePublishers, useCategories } from "@/features/resources/queries";
import {
    useCreateAuthor,
    useDeleteAuthor,
    useCreatePublisher,
    useDeletePublisher,
    useCreateCategory,
    useDeleteCategory,
} from "@/features/resources/mutations";
import { useToast } from "@/composables/useToast";
import NeoConfirmModal from "@/components/ui/NeoConfirmModal.vue";

type Tab = "AUTHORS" | "PUBLISHERS" | "CATEGORIES";
const activeTab = ref<Tab>("AUTHORS");
const searchQuery = ref("");
const { addToast } = useToast();

// Queries
const { data: authors, isLoading: l1 } = useAuthors();
const { data: publishers, isLoading: l2 } = usePublishers();
const { data: categories, isLoading: l3 } = useCategories();

// Mutations
const createAuthor = useCreateAuthor();
const deleteAuthor = useDeleteAuthor();
const createPublisher = useCreatePublisher();
const deletePublisher = useDeletePublisher();
const createCategory = useCreateCategory();
const deleteCategory = useDeleteCategory();

// UI State
const showModal = ref(false);
const deleteId = ref<string | null>(null);
const formData = ref({
    name: "",
    extra: "",
});

const isLoading = computed(() => l1.value || l2.value || l3.value);

// Typed Filters to avoid 'any'
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

const handleOpenModal = () => {
    formData.value = { name: "", extra: "" };
    showModal.value = true;
};

const handleSubmit = () => {
    if (!formData.value.name) return;

    const onSuccess = () => {
        addToast({ title: "Thành công", variant: "success" });
        showModal.value = false;
    };

    if (activeTab.value === "AUTHORS") {
        createAuthor.mutate(
            { tenTacGia: formData.value.name, tieuSu: formData.value.extra },
            { onSuccess },
        );
    } else if (activeTab.value === "PUBLISHERS") {
        createPublisher.mutate(
            { tenNhaXuatBan: formData.value.name, diaChi: formData.value.extra || "Chưa cập nhật" },
            { onSuccess },
        );
    } else {
        createCategory.mutate({ tenDanhMuc: formData.value.name }, { onSuccess });
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

const getHeaderColor = computed(() => {
    switch (activeTab.value) {
        case "AUTHORS":
            return "bg-yellow-300";
        case "PUBLISHERS":
            return "bg-blue-300";
        case "CATEGORIES":
            return "bg-green-300";
        default:
            return "bg-gray-200";
    }
});

const getModalTitle = computed(() => {
    switch (activeTab.value) {
        case "AUTHORS":
            return "Thêm Tác Giả";
        case "PUBLISHERS":
            return "Thêm Nhà Xuất Bản";
        case "CATEGORIES":
            return "Thêm Danh Mục";
        default:
            return "Thêm Mới";
    }
});
</script>

<template>
    <div class="space-y-6">
        <div class="flex gap-4 border-b-4 border-black pb-1 overflow-x-auto">
            <button
                @click="
                    activeTab = 'AUTHORS';
                    searchQuery = '';
                "
                class="px-6 py-2 font-bold uppercase transition-all flex items-center gap-2 border-t-4 border-l-4 border-r-4 border-black relative -bottom-2 bg-white hover:bg-yellow-100 whitespace-nowrap"
                :class="{ 'bg-yellow-300 hover:bg-yellow-300': activeTab === 'AUTHORS' }"
            >
                <Users :size="18" /> Tác Giả
            </button>
            <button
                @click="
                    activeTab = 'PUBLISHERS';
                    searchQuery = '';
                "
                class="px-6 py-2 font-bold uppercase transition-all flex items-center gap-2 border-t-4 border-l-4 border-r-4 border-black relative -bottom-2 bg-white hover:bg-blue-100 whitespace-nowrap"
                :class="{ 'bg-blue-300 hover:bg-blue-300': activeTab === 'PUBLISHERS' }"
            >
                <Building :size="18" /> Nhà Xuất Bản
            </button>
            <button
                @click="
                    activeTab = 'CATEGORIES';
                    searchQuery = '';
                "
                class="px-6 py-2 font-bold uppercase transition-all flex items-center gap-2 border-t-4 border-l-4 border-r-4 border-black relative -bottom-2 bg-white hover:bg-green-100 whitespace-nowrap"
                :class="{ 'bg-green-300 hover:bg-green-300': activeTab === 'CATEGORIES' }"
            >
                <Tag :size="18" /> Danh Mục
            </button>
        </div>

        <div
            class="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 border-4 border-black shadow-neo"
        >
            <div class="relative w-full md:w-96">
                <Search class="absolute left-3 top-3 text-gray-500" :size="20" />
                <input
                    v-model="searchQuery"
                    type="text"
                    :placeholder="`Tìm kiếm ${activeTab === 'AUTHORS' ? 'tác giả' : activeTab === 'PUBLISHERS' ? 'nhà xuất bản' : 'danh mục'}...`"
                    class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-black font-bold outline-none focus:shadow-neo-sm transition-all placeholder:font-normal"
                />
            </div>

            <NeoButton
                @click="handleOpenModal"
                class="w-full md:w-auto flex items-center justify-center gap-2"
            >
                <Plus :size="20" stroke-width="3" /> Thêm Mới
            </NeoButton>
        </div>

        <div class="bg-white border-4 border-black shadow-neo min-h-[400px]">
            <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
                <Loader2 :size="48" class="animate-spin text-black mb-4" />
                <p class="font-bold text-xl uppercase">Đang tải dữ liệu...</p>
            </div>

            <div v-else class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr
                            class="border-b-4 border-black text-black"
                            :class="{
                                'bg-yellow-300': activeTab === 'AUTHORS',
                                'bg-blue-300': activeTab === 'PUBLISHERS',
                                'bg-green-300': activeTab === 'CATEGORIES',
                            }"
                        >
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
                                class="p-4 border-r-2 border-black font-black uppercase tracking-wide w-24 text-center"
                            >
                                Số sách
                            </th>
                            <th class="p-4 font-black uppercase tracking-wide w-32 text-center">
                                Thao tác
                            </th>
                        </tr>
                    </thead>

                    <tbody v-if="activeTab === 'AUTHORS'" class="divide-y-2 divide-black">
                        <tr
                            v-for="(item, index) in filteredAuthors"
                            :key="item._id"
                            class="hover:bg-gray-50 transition-colors group"
                        >
                            <td
                                class="p-4 border-r-2 border-black text-center font-bold text-gray-500"
                            >
                                {{ index + 1 }}
                            </td>
                            <td class="p-4 border-r-2 border-black font-bold text-lg">
                                {{ item.tenTacGia }}
                            </td>
                            <td class="p-4 border-r-2 border-black text-gray-600 line-clamp-2">
                                {{ item.tieuSu || "—" }}
                            </td>
                            <td class="p-4 border-r-2 border-black text-center">
                                <div
                                    class="flex items-center justify-center gap-1 font-black text-lg"
                                >
                                    <BookOpen :size="16" class="text-gray-400" />
                                    {{ item.soLuongSach || 0 }}
                                </div>
                            </td>
                            <td class="p-4 align-middle text-center">
                                <button
                                    @click="deleteId = item._id"
                                    class="p-2 bg-red-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:bg-red-500 transition-all text-black"
                                    title="Xóa"
                                >
                                    <Trash2 :size="18" />
                                </button>
                            </td>
                        </tr>
                    </tbody>

                    <tbody v-if="activeTab === 'PUBLISHERS'" class="divide-y-2 divide-black">
                        <tr
                            v-for="(item, index) in filteredPublishers"
                            :key="item._id"
                            class="hover:bg-gray-50 transition-colors group"
                        >
                            <td
                                class="p-4 border-r-2 border-black text-center font-bold text-gray-500"
                            >
                                {{ index + 1 }}
                            </td>
                            <td class="p-4 border-r-2 border-black font-bold text-lg">
                                {{ item.tenNhaXuatBan }}
                            </td>
                            <td class="p-4 border-r-2 border-black text-gray-600">
                                {{ item.diaChi }}
                            </td>
                            <td class="p-4 border-r-2 border-black text-center">
                                <div
                                    class="flex items-center justify-center gap-1 font-black text-lg"
                                >
                                    <BookOpen :size="16" class="text-gray-400" />
                                    {{ item.soLuongSach || 0 }}
                                </div>
                            </td>
                            <td class="p-4 align-middle text-center">
                                <button
                                    @click="deleteId = item._id"
                                    class="p-2 bg-red-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:bg-red-500 transition-all text-black"
                                    title="Xóa"
                                >
                                    <Trash2 :size="18" />
                                </button>
                            </td>
                        </tr>
                    </tbody>

                    <tbody v-if="activeTab === 'CATEGORIES'" class="divide-y-2 divide-black">
                        <tr
                            v-for="(item, index) in filteredCategories"
                            :key="item._id"
                            class="hover:bg-gray-50 transition-colors group"
                        >
                            <td
                                class="p-4 border-r-2 border-black text-center font-bold text-gray-500"
                            >
                                {{ index + 1 }}
                            </td>
                            <td class="p-4 border-r-2 border-black font-bold text-lg">
                                <span
                                    class="bg-green-100 border-2 border-black px-3 py-1 shadow-neo-sm inline-block"
                                    >{{ item.tenDanhMuc }}</span
                                >
                            </td>
                            <td class="p-4 border-r-2 border-black text-center">
                                <div
                                    class="flex items-center justify-center gap-1 font-black text-lg"
                                >
                                    <BookOpen :size="16" class="text-gray-400" />
                                    {{ item.soLuongSach || 0 }}
                                </div>
                            </td>
                            <td class="p-4 align-middle text-center">
                                <button
                                    @click="deleteId = item._id"
                                    class="p-2 bg-red-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:bg-red-500 transition-all text-black"
                                    title="Xóa"
                                >
                                    <Trash2 :size="18" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <BaseModal
            :isOpen="showModal"
            :title="getModalTitle"
            :headerClass="getHeaderColor"
            @close="showModal = false"
        >
            <div class="space-y-4">
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
                    placeholder="Nhập tên..."
                />

                <NeoInput
                    v-if="activeTab === 'AUTHORS'"
                    id="bio"
                    label="Tiểu sử (Tùy chọn)"
                    v-model="formData.extra"
                    placeholder="Vài nét về tác giả..."
                />

                <NeoInput
                    v-if="activeTab === 'PUBLISHERS'"
                    id="address"
                    label="Địa chỉ"
                    v-model="formData.extra"
                    placeholder="Số nhà, tên đường, thành phố..."
                />

                <div class="flex justify-end pt-2 border-t-2 border-black mt-4">
                    <NeoButton @click="handleSubmit" class="w-full"> Xác nhận Thêm </NeoButton>
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
