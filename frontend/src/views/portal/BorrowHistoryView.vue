<script setup lang="ts">
import { useRouter } from "vue-router";
import { ArrowLeft, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-vue-next";
import { useBorrowHistory } from "@/features/books/queries";
import type { TheoDoiMuonSach } from "@/types/models/TheoDoiMuonSach";

const router = useRouter();
const { data: history, isLoading } = useBorrowHistory();

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN");
};

const getStatusBadge = (record: TheoDoiMuonSach) => {
    switch (record.trangThai) {
        case "DANG_CHO":
            return {
                text: "Chờ duyệt",
                class: "bg-yellow-100 text-yellow-800 border-yellow-300",
                icon: Clock,
            };
        case "DA_TU_CHOI":
            return {
                text: "Từ chối",
                class: "bg-red-100 text-red-800 border-red-300",
                icon: XCircle,
            };
        case "DA_TRA":
            return {
                text: "Đã trả",
                class: "bg-gray-100 text-gray-700 border-gray-300",
                icon: CheckCircle,
            };
        case "DANG_MUON":
            // Check for overdue (14 days limit)
            // eslint-disable-next-line no-case-declarations
            const isOverdue =
                new Date().getTime() - new Date(record.ngayMuon).getTime() >
                14 * 24 * 60 * 60 * 1000;

            if (isOverdue) {
                return {
                    text: "Quá hạn",
                    class: "bg-red-200 text-red-900 border-red-400 font-bold",
                    icon: AlertCircle,
                };
            }
            return {
                text: "Đang mượn",
                class: "bg-green-100 text-green-800 border-green-300",
                icon: Clock,
            };
        default:
            return {
                text: "Không rõ",
                class: "bg-gray-100 text-gray-500 border-gray-300",
                icon: Clock,
            };
    }
};
</script>

<template>
    <div class="w-full max-w-4xl mx-auto space-y-6">
        <div class="flex items-center justify-between">
            <button
                @click="router.push('/portal/books')"
                class="flex items-center gap-2 font-bold hover:underline"
            >
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
                        <th class="p-4 font-black uppercase border-r-2 border-black w-40">
                            Ngày Mượn
                        </th>
                        <th class="p-4 font-black uppercase border-r-2 border-black w-40">
                            Ngày Trả
                        </th>
                        <th class="p-4 font-black uppercase w-40 text-center">Trạng Thái</th>
                    </tr>
                </thead>
                <tbody class="divide-y-2 divide-black">
                    <tr v-for="(item, index) in history" :key="item._id" class="hover:bg-gray-50">
                        <td class="p-4 border-r-2 border-black font-bold text-center">
                            {{ index + 1 }}
                        </td>
                        <td class="p-4 border-r-2 border-black">
                            <p class="font-bold text-lg">
                                {{ item.banSao?.sach?.tenSach || "Sách đã bị xóa" }}
                            </p>
                            <p class="text-xs font-mono text-gray-500">
                                Mã bản sao: {{ item.banSao?.maBanSao }}
                            </p>
                        </td>
                        <td class="p-4 border-r-2 border-black font-medium">
                            {{ formatDate(item.ngayMuon) }}
                        </td>
                        <td class="p-4 border-r-2 border-black font-medium">
                            {{ item.ngayTra ? formatDate(item.ngayTra) : "—" }}
                        </td>
                        <td class="p-4 text-center align-middle">
                            <span
                                class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border-2"
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
</template>
