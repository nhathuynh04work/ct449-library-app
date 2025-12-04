<script setup lang="ts">
import { ref, computed } from "vue";
import { 
    Users, 
    Building, 
    Tag, 
    Plus, 
    Trash2, 
    Loader2 
} from "lucide-vue-next";
import NeoButton from "@/components/ui/NeoButton.vue";
import NeoInput from "@/components/ui/NeoInput.vue";
import { useAuthors, usePublishers, useCategories } from "@/features/resources/queries";
import { 
    useCreateAuthor, useDeleteAuthor,
    useCreatePublisher, useDeletePublisher,
    useCreateCategory, useDeleteCategory
} from "@/features/resources/mutations";
import { useToast } from "@/composables/useToast";

type Tab = "AUTHORS" | "PUBLISHERS" | "CATEGORIES";
const activeTab = ref<Tab>("AUTHORS");
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

// Form Data
const showModal = ref(false);
const formData = ref({
    name: "",
    extra: "" // bio for author, address for publisher
});

// Helpers
const isLoading = computed(() => l1.value || l2.value || l3.value);

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
        createAuthor.mutate({ tenTacGia: formData.value.name, tieuSu: formData.value.extra }, { onSuccess });
    } else if (activeTab.value === "PUBLISHERS") {
        createPublisher.mutate({ tenNhaXuatBan: formData.value.name, diaChi: formData.value.extra || "Chưa cập nhật" }, { onSuccess });
    } else {
        createCategory.mutate({ tenDanhMuc: formData.value.name }, { onSuccess });
    }
};

const handleDelete = (id: string) => {
    if(!confirm("Bạn có chắc chắn muốn xóa?")) return;
    
    const onSuccess = () => addToast({ title: "Đã xóa", variant: "info" });

    if (activeTab.value === "AUTHORS") deleteAuthor.mutate(id, { onSuccess });
    else if (activeTab.value === "PUBLISHERS") deletePublisher.mutate(id, { onSuccess });
    else deleteCategory.mutate(id, { onSuccess });
};
</script>

<template>
    <div class="space-y-6">
        <div class="flex gap-4 border-b-4 border-black pb-1">
            <button 
                @click="activeTab = 'AUTHORS'"
                class="px-6 py-2 font-bold uppercase transition-all flex items-center gap-2 border-t-4 border-l-4 border-r-4 border-black relative -bottom-2 bg-white hover:bg-yellow-100"
                :class="{ 'bg-yellow-300 hover:bg-yellow-300': activeTab === 'AUTHORS' }"
            >
                <Users :size="18" /> Tác Giả
            </button>
            <button 
                @click="activeTab = 'PUBLISHERS'"
                class="px-6 py-2 font-bold uppercase transition-all flex items-center gap-2 border-t-4 border-l-4 border-r-4 border-black relative -bottom-2 bg-white hover:bg-blue-100"
                :class="{ 'bg-blue-300 hover:bg-blue-300': activeTab === 'PUBLISHERS' }"
            >
                <Building :size="18" /> Nhà Xuất Bản
            </button>
            <button 
                @click="activeTab = 'CATEGORIES'"
                class="px-6 py-2 font-bold uppercase transition-all flex items-center gap-2 border-t-4 border-l-4 border-r-4 border-black relative -bottom-2 bg-white hover:bg-green-100"
                :class="{ 'bg-green-300 hover:bg-green-300': activeTab === 'CATEGORIES' }"
            >
                <Tag :size="18" /> Danh Mục
            </button>
        </div>

        <div class="bg-white border-4 border-black shadow-neo p-6 min-h-[400px]">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-black uppercase">
                    Quản lý {{ activeTab === 'AUTHORS' ? 'Tác giả' : activeTab === 'PUBLISHERS' ? 'Nhà Xuất Bản' : 'Danh Mục' }}
                </h2>
                <NeoButton @click="handleOpenModal" class="flex items-center gap-2">
                    <Plus :size="20" /> Thêm mới
                </NeoButton>
            </div>

            <div v-if="isLoading" class="flex justify-center py-10">
                <Loader2 :size="40" class="animate-spin" />
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <template v-if="activeTab === 'AUTHORS'">
                    <div v-for="author in authors" :key="author._id" class="border-2 border-black p-4 shadow-neo-sm bg-yellow-50 relative group">
                        <h3 class="font-bold text-lg">{{ author.tenTacGia }}</h3>
                        <p class="text-sm text-gray-600 line-clamp-2">{{ author.tieuSu || 'Chưa có tiểu sử' }}</p>
                        <button @click="handleDelete(author._id)" class="absolute top-2 right-2 p-1 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 :size="16" />
                        </button>
                    </div>
                </template>

                <template v-if="activeTab === 'PUBLISHERS'">
                    <div v-for="pub in publishers" :key="pub._id" class="border-2 border-black p-4 shadow-neo-sm bg-blue-50 relative group">
                        <h3 class="font-bold text-lg">{{ pub.tenNhaXuatBan }}</h3>
                        <p class="text-sm text-gray-600 flex items-center gap-1">
                            📍 {{ pub.diaChi }}
                        </p>
                        <button @click="handleDelete(pub._id)" class="absolute top-2 right-2 p-1 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 :size="16" />
                        </button>
                    </div>
                </template>

                <template v-if="activeTab === 'CATEGORIES'">
                    <div v-for="cat in categories" :key="cat._id" class="border-2 border-black p-3 shadow-neo-sm bg-green-50 flex justify-between items-center group">
                        <span class="font-bold">{{ cat.tenDanhMuc }}</span>
                        <button @click="handleDelete(cat._id)" class="p-1 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 :size="16" />
                        </button>
                    </div>
                </template>
            </div>
            
            <div v-if="!isLoading && ((activeTab === 'AUTHORS' && !authors?.length) || (activeTab === 'PUBLISHERS' && !publishers?.length) || (activeTab === 'CATEGORIES' && !categories?.length))" class="text-center py-10 text-gray-500 font-bold italic">
                Chưa có dữ liệu. Hãy thêm mới ngay!
            </div>
        </div>

        <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" @click.self="showModal = false">
            <div class="bg-white border-4 border-black shadow-neo w-full max-w-md animate-in">
                <div class="bg-black text-white p-4 font-bold uppercase flex justify-between">
                    <span>Thêm {{ activeTab === 'AUTHORS' ? 'Tác giả' : activeTab === 'PUBLISHERS' ? 'Nhà Xuất Bản' : 'Danh Mục' }}</span>
                    <button @click="showModal = false">✕</button>
                </div>
                <div class="p-6 space-y-4">
                    <NeoInput 
                        id="name" 
                        :label="activeTab === 'AUTHORS' ? 'Tên Tác giả' : activeTab === 'PUBLISHERS' ? 'Tên NXB' : 'Tên Danh mục'" 
                        v-model="formData.name" 
                    />
                    
                    <NeoInput 
                        v-if="activeTab === 'AUTHORS'" 
                        id="bio" 
                        label="Tiểu sử" 
                        v-model="formData.extra" 
                        placeholder="Ngắn gọn..."
                    />
                    
                    <NeoInput 
                        v-if="activeTab === 'PUBLISHERS'" 
                        id="address" 
                        label="Địa chỉ" 
                        v-model="formData.extra" 
                        placeholder="Số nhà, đường,..."
                    />

                    <NeoButton @click="handleSubmit" class="w-full mt-4">Xác nhận</NeoButton>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-in {
    animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes popIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
</style>