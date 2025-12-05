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
    AlertCircle,
    BookOpen,
} from "lucide-vue-next";
import NeoButton from "@/components/ui/NeoButton.vue";
import NeoInput from "@/components/ui/NeoInput.vue";
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

// Helpers
const isLoading = computed(() => l1.value || l2.value || l3.value);

// Filter Data
const filteredData = computed(() => {
    const query = searchQuery.value.toLowerCase();

    if (activeTab.value === "AUTHORS") {
        return (authors.value || []).filter((a) => a.tenTacGia.toLowerCase().includes(query));
    } else if (activeTab.value === "PUBLISHERS") {
        return (publishers.value || []).filter((p) =>
            p.tenNhaXuatBan.toLowerCase().includes(query),
        );
    } else {
        return (categories.value || []).filter((c) => c.tenDanhMuc.toLowerCase().includes(query));
    }
});

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
                <Plus :size="20" stroke-width="3" />
                Thêm Mới
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

                            <template v-if="activeTab === 'AUTHORS'">
                                <th
                                    class="p-4 border-r-2 border-black font-black uppercase tracking-wide w-1/3"
                                >
                                    Tên Tác Giả
                                </th>
                                <th
                                    class="p-4 border-r-2 border-black font-black uppercase tracking-wide"
                                >
                                    Tiểu Sử
                                </th>
                            </template>

                            <template v-if="activeTab === 'PUBLISHERS'">
                                <th
                                    class="p-4 border-r-2 border-black font-black uppercase tracking-wide w-1/3"
                                >
                                    Tên Nhà Xuất Bản
                                </th>
                                <th
                                    class="p-4 border-r-2 border-black font-black uppercase tracking-wide"
                                >
                                    Địa Chỉ
                                </th>
                            </template>

                            <template v-if="activeTab === 'CATEGORIES'">
                                <th
                                    class="p-4 border-r-2 border-black font-black uppercase tracking-wide"
                                >
                                    Tên Danh Mục
                                </th>
                            </template>

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
                    <tbody class="divide-y-2 divide-black">
                        <tr
                            v-for="(item, index) in filteredData"
                            :key="(item as any)._id"
                            class="hover:bg-gray-50 transition-colors group"
                        >
                            <td
                                class="p-4 border-r-2 border-black text-center font-bold text-gray-500"
                            >
                                {{ index + 1 }}
                            </td>

                            <template v-if="activeTab === 'AUTHORS'">
                                <td class="p-4 border-r-2 border-black font-bold text-lg">
                                    {{ (item as any).tenTacGia }}
                                </td>
                                <td class="p-4 border-r-2 border-black text-gray-600 line-clamp-2">
                                    {{ (item as any).tieuSu || "—" }}
                                </td>
                            </template>

                            <template v-if="activeTab === 'PUBLISHERS'">
                                <td class="p-4 border-r-2 border-black font-bold text-lg">
                                    {{ (item as any).tenNhaXuatBan }}
                                </td>
                                <td class="p-4 border-r-2 border-black text-gray-600">
                                    {{ (item as any).diaChi }}
                                </td>
                            </template>

                            <template v-if="activeTab === 'CATEGORIES'">
                                <td class="p-4 border-r-2 border-black font-bold text-lg">
                                    <span
                                        class="bg-green-100 border-2 border-black px-3 py-1 shadow-neo-sm inline-block"
                                    >
                                        {{ (item as any).tenDanhMuc }}
                                    </span>
                                </td>
                            </template>

                            <td class="p-4 border-r-2 border-black text-center">
                                <div
                                    class="flex items-center justify-center gap-1 font-black text-lg"
                                >
                                    <BookOpen :size="16" class="text-gray-400" />
                                    {{ (item as any).soLuongSach || 0 }}
                                </div>
                            </td>

                            <td class="p-4 align-middle text-center">
                                <button
                                    @click="deleteId = (item as any)._id"
                                    class="p-2 bg-red-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:bg-red-500 transition-all text-black"
                                    title="Xóa"
                                >
                                    <Trash2 :size="18" />
                                </button>
                            </td>
                        </tr>

                        <tr v-if="filteredData.length === 0">
                            <td colspan="5" class="p-12 text-center text-gray-500">
                                <div class="flex flex-col items-center gap-2">
                                    <AlertCircle :size="32" />
                                    <p class="font-bold text-lg">Không tìm thấy dữ liệu phù hợp.</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div
            v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            @click.self="showModal = false"
        >
            <div class="bg-white border-4 border-black shadow-neo w-full max-w-md animate-in">
                <div
                    class="p-4 border-b-4 border-black flex justify-between items-center"
                    :class="{
                        'bg-yellow-300': activeTab === 'AUTHORS',
                        'bg-blue-300': activeTab === 'PUBLISHERS',
                        'bg-green-300': activeTab === 'CATEGORIES',
                    }"
                >
                    <h2 class="text-lg font-black uppercase font-display">
                        Thêm
                        {{
                            activeTab === "AUTHORS"
                                ? "Tác giả"
                                : activeTab === "PUBLISHERS"
                                  ? "Nhà Xuất Bản"
                                  : "Danh Mục"
                        }}
                    </h2>
                    <button
                        @click="showModal = false"
                        class="hover:bg-white/30 p-1 border-2 border-transparent hover:border-black transition-all"
                    >
                        ✕
                    </button>
                </div>
                <div class="p-6 space-y-4">
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

                    <div class="flex justify-end pt-2">
                        <NeoButton @click="handleSubmit" class="w-full"> Xác nhận Thêm </NeoButton>
                    </div>
                </div>
            </div>
        </div>

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
