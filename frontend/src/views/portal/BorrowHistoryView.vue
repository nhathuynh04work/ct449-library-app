<script setup lang="ts">
import { useRouter } from "vue-router";
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-vue-next";
import { useBorrowHistory } from "@/features/books/queries";

const router = useRouter();
const { data: history, isLoading } = useBorrowHistory();

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN');
};

const getStatusBadge = (record: any) => {
    if (record.ngayTra) return { text: "Đã trả", class: "bg-gray-200 text-gray-700", icon: CheckCircle };
    // Simple logic: if borrowed > 14 days ago and no return date -> Overdue (Example)
    const isOverdue = new Date().getTime() - new Date(record.ngayMuon).getTime() > 14 * 24 * 60 * 60 * 1000;
    
    if (isOverdue) return { text: "Quá hạn", class: "bg-red-200 text-red-800", icon: AlertCircle };
    return { text: "Đang mượn", class: "bg-green-200 text-green-800", icon: Clock };
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 font-body p-6 flex justify-center">
        <div class="w-full max-w-4xl space-y-6">
            <div class="flex items-center justify-between">
                <button @click="router.push('/portal/books')" class="flex items-center gap-2 font-bold hover:underline">
                    <ArrowLeft :size="20" /> Trang chủ
                </button>
                <h1 class="text-2xl font-black uppercase font-display">Lịch Sử Mượn</h1>
            </div>

            <div v-if="isLoading" class="text-center py-10 font-bold">Đang tải...</div>

            <div v-else class="bg-white border-4 border-black shadow-neo overflow-hidden">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-yellow-300 border-b-4 border-black">
                            <th class="p-4 font-black uppercase border-r-2 border-black w-20">#</th>
                            <th class="p-4 font-black uppercase border-r-2 border-black">Tên Sách</th>
                            <th class="p-4 font-black uppercase border-r-2 border-black w-40">Ngày Mượn</th>
                            <th class="p-4 font-black uppercase border-r-2 border-black w-40">Ngày Trả</th>
                            <th class="p-4 font-black uppercase w-40 text-center">Trạng Thái</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y-2 divide-black">
                        <tr v-for="(item, index) in history" :key="item._id" class="hover:bg-gray-50">
                            <td class="p-4 border-r-2 border-black font-bold text-center">{{ index + 1 }}</td>
                            <td class="p-4 border-r-2 border-black">
                                <p class="font-bold text-lg">{{ item.banSao?.sach?.tenSach || 'Sách đã bị xóa' }}</p>
                                <p class="text-xs font-mono text-gray-500">Mã bản sao: {{ item.banSao?.maBanSao }}</p>
                            </td>
                            <td class="p-4 border-r-2 border-black font-medium">{{ formatDate(item.ngayMuon) }}</td>
                            <td class="p-4 border-r-2 border-black font-medium">
                                {{ item.ngayTra ? formatDate(item.ngayTra) : '—' }}
                            </td>
                            <td class="p-4 text-center">
                                <span 
                                    class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border border-black/20"
                                    :class="getStatusBadge(item).class"
                                >
                                    <component :is="getStatusBadge(item).icon" :size="14" />
                                    {{ getStatusBadge(item).text }}
                                </span>
                            </td>
                        </tr>
                        <tr v-if="!history || history.length === 0">
                            <td colspan="5" class="p-8 text-center text-gray-500 font-bold italic">
                                Bạn chưa mượn cuốn sách nào.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>