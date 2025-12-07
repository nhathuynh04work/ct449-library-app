<script setup lang="ts">
import { ref, computed } from "vue";
import { Search, Lock, Unlock } from "lucide-vue-next";
import { useReaders } from "@/features/management/queries";
import { useToggleBlockReader } from "@/features/management/mutations";
import { useToast } from "@/composables/useToast";
import type { DocGia } from "@/types/models/DocGia";

const { data: readers, isLoading } = useReaders();
const { mutate: toggleBlock, isPending: isToggling } = useToggleBlockReader();
const { addToast } = useToast();

const searchQuery = ref("");

const filteredReaders = computed(() => {
    if (!readers.value) return [];
    return readers.value.filter(
        (r) =>
            r.ten.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            r.maDocGia.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
});

const handleToggleBlock = (reader: DocGia) => {
    if (isToggling.value) return;

    toggleBlock(reader._id, {
        onSuccess: (data) => {
            addToast({
                title: data.biKhoa ? "Đã Khóa" : "Đã Mở Khóa",
                description: `Đã cập nhật trạng thái tài khoản cho ${data.hoLot} ${data.ten}.`,
                variant: data.biKhoa ? "warning" : "success",
            });
        },
        onError: (err) => {
            addToast({
                title: "Lỗi",
                description: err.message,
                variant: "error",
            });
        },
    });
};

const formatDate = (date: string) => new Date(date).toLocaleDateString("vi-VN");
</script>

<template>
    <div class="space-y-6">
        <div
            class="flex justify-between items-center bg-white p-4 border-4 border-black shadow-neo"
        >
            <div class="relative w-full">
                <Search class="absolute left-3 top-3 text-gray-500" :size="20" />
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Tìm độc giả..."
                    class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-black font-bold outline-none focus:shadow-neo-sm transition-all"
                />
            </div>
        </div>

        <div class="bg-white border-4 border-black shadow-neo overflow-hidden min-h-[400px]">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-green-300 border-b-4 border-black text-black">
                        <th class="p-4 border-r-2 border-black font-black uppercase">Mã ĐG</th>
                        <th class="p-4 border-r-2 border-black font-black uppercase">Họ Tên</th>
                        <th class="p-4 border-r-2 border-black font-black uppercase">Thông Tin</th>
                        <th class="p-4 border-r-2 border-black font-black uppercase">Ngày ĐK</th>
                        <th class="p-4 font-black uppercase text-center w-32">Thao Tác</th>
                    </tr>
                </thead>
                <tbody class="divide-y-2 divide-black">
                    <tr v-if="isLoading">
                        <td colspan="5" class="p-8 text-center font-bold">Đang tải dữ liệu...</td>
                    </tr>
                    <tr
                        v-for="reader in filteredReaders"
                        :key="reader._id"
                        class="hover:bg-green-50 transition-colors"
                        :class="{ 'opacity-50 bg-gray-100 hover:bg-gray-100': reader.biKhoa }"
                    >
                        <td class="p-4 border-r-2 border-black font-mono font-bold">
                            <span v-if="reader.biKhoa" class="line-through text-red-600">{{
                                reader.maDocGia
                            }}</span>
                            <span v-else>{{ reader.maDocGia }}</span>
                        </td>
                        <td class="p-4 border-r-2 border-black font-bold">
                            {{ reader.hoLot }} {{ reader.ten }}
                            <span
                                v-if="reader.biKhoa"
                                class="ml-2 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full uppercase"
                                >Đã Khóa</span
                            >
                        </td>
                        <td class="p-4 border-r-2 border-black text-sm">
                            <p>SĐT: {{ reader.soDienThoai }}</p>
                            <p class="truncate max-w-[250px]" :title="reader.diaChi">
                                {{ reader.diaChi }}
                            </p>
                        </td>
                        <td class="p-4 border-r-2 border-black font-mono text-sm">
                            {{ reader.createdAt ? formatDate(reader.createdAt.toString()) : "-" }}
                        </td>
                        <td class="p-4 text-center">
                            <button
                                @click="handleToggleBlock(reader)"
                                class="p-2 border-2 border-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all active:bg-gray-100"
                                :class="
                                    reader.biKhoa
                                        ? 'bg-yellow-300 hover:bg-yellow-400'
                                        : 'bg-red-400 hover:bg-red-500'
                                "
                                :title="reader.biKhoa ? 'Mở khóa tài khoản' : 'Khóa tài khoản'"
                            >
                                <component :is="reader.biKhoa ? Unlock : Lock" :size="18" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
