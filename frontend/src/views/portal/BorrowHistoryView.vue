<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
    ArrowLeft,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    Trash2,
    Ban,
    CalendarDays,
    Hash,
} from "lucide-vue-next";
import { useBorrowHistory } from "@/features/books/queries";
import { useCancelBorrow } from "@/features/books/mutations";
import { useToast } from "@/composables/useToast";
import NeoConfirmModal from "@/components/ui/NeoConfirmModal.vue";
import NeoButton from "@/components/ui/NeoButton.vue";
import type { TheoDoiMuonSach } from "@/types/models/TheoDoiMuonSach";

const router = useRouter();
const { data: history, isLoading } = useBorrowHistory();
const { mutate: cancelBorrow, isPending: isCancelling } = useCancelBorrow();
const { addToast } = useToast();

const showConfirm = ref(false);
const selectedRecord = ref<TheoDoiMuonSach | null>(null);

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN");
};

const getStatusBadge = (record: TheoDoiMuonSach) => {
    switch (record.trangThai) {
        case "DANG_CHO":
            return {
                text: "Chờ duyệt",
                class: "bg-yellow-300 text-black border-2 border-black shadow-neo-sm",
                icon: Clock,
            };
        case "DA_TU_CHOI":
            return {
                text: "Từ chối",
                class: "bg-red-400 text-black border-2 border-black shadow-neo-sm",
                icon: Ban,
            };
        case "DA_HUY":
            return {
                text: "Đã hủy",
                class: "bg-gray-300 text-black border-2 border-black shadow-neo-sm decoration-line-through",
                icon: XCircle,
            };
        case "DA_TRA":
            return {
                text: "Đã trả",
                class: "bg-green-300 text-black border-2 border-black shadow-neo-sm",
                icon: CheckCircle,
            };
        case "DANG_MUON":
            // eslint-disable-next-line no-case-declarations
            const now = new Date().getTime();
            let isOverdue = false;

            if (record.hanTra) {
                isOverdue = now > new Date(record.hanTra).getTime();
            } else {
                isOverdue = now - new Date(record.ngayMuon).getTime() > 14 * 24 * 60 * 60 * 1000;
            }

            if (isOverdue)
                return {
                    text: "QUÁ HẠN",
                    class: "bg-red-600 text-white border-2 border-black shadow-neo-sm animate-pulse",
                    icon: AlertCircle,
                };
            return {
                text: "Đang mượn",
                class: "bg-blue-300 text-black border-2 border-black shadow-neo-sm",
                icon: Clock,
            };
        default:
            return {
                text: "Không rõ",
                class: "bg-white text-black border-2 border-black shadow-neo-sm",
                icon: Clock,
            };
    }
};

const handleCancelClick = (item: TheoDoiMuonSach) => {
    selectedRecord.value = item;
    showConfirm.value = true;
};

const confirmCancel = () => {
    if (!selectedRecord.value) return;

    cancelBorrow(selectedRecord.value._id, {
        onSuccess: () => {
            addToast({
                title: "Thành công",
                description: "Đã hủy yêu cầu mượn sách.",
                variant: "success",
            });
            showConfirm.value = false;
            selectedRecord.value = null;
        },
        onError: (err) => {
            addToast({ title: "Lỗi", description: err.message, variant: "error" });
            showConfirm.value = false;
        },
    });
};
</script>

<template>
    <div class="w-full space-y-8 pb-10">
        <div
            class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-4 border-black p-6 shadow-neo"
        >
            <div>
                <h1 class="text-4xl font-black uppercase font-display leading-none mb-2">
                    Lịch Sử Mượn
                </h1>
                <p class="font-bold text-gray-600">Theo dõi trạng thái các sách bạn đã đăng ký.</p>
            </div>
            <NeoButton
                @click="router.push('/portal/books')"
                variant="secondary"
                class="flex items-center gap-2 self-start md:self-center"
            >
                <ArrowLeft :size="20" /> Quay lại Thư viện
            </NeoButton>
        </div>

        <div
            v-if="isLoading"
            class="flex flex-col items-center justify-center py-20 bg-white border-4 border-black shadow-neo"
        >
            <div
                class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black mb-4"
            ></div>
            <p class="font-black text-xl uppercase font-display">Đang tải dữ liệu...</p>
        </div>

        <div v-else class="bg-white border-4 border-black shadow-neo overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-yellow-300 text-black border-b-4 border-black">
                            <th
                                class="p-4 font-black uppercase border-r-2 border-black w-16 text-center"
                            >
                                #
                            </th>
                            <th class="p-4 font-black uppercase border-r-2 border-black">
                                Thông Tin Sách
                            </th>
                            <th class="p-4 font-black uppercase border-r-2 border-black w-48">
                                Thời Gian
                            </th>
                            <th
                                class="p-4 font-black uppercase border-r-2 border-black w-40 text-center"
                            >
                                Trạng Thái
                            </th>
                            <th class="p-4 font-black uppercase w-24 text-center">Tác Vụ</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y-4 divide-black">
                        <tr
                            v-for="(item, index) in history"
                            :key="item._id"
                            class="hover:bg-purple-50 transition-colors group"
                        >
                            <td
                                class="p-4 border-r-4 border-black font-black text-xl text-center bg-gray-100"
                            >
                                {{ index + 1 }}
                            </td>

                            <td class="p-4 border-r-4 border-black align-top">
                                <div class="flex flex-col gap-1">
                                    <h3
                                        class="font-black text-xl uppercase font-display leading-tight group-hover:underline decoration-2 underline-offset-2"
                                    >
                                        {{
                                            item.banSao?.sach?.tenSach ||
                                            "Sách đã bị xóa khỏi hệ thống"
                                        }}
                                    </h3>
                                    <div class="flex items-center gap-2 mt-1">
                                        <span
                                            class="inline-flex items-center gap-1 bg-gray-200 border border-black px-1.5 py-0.5 text-xs font-mono font-bold"
                                        >
                                            <Hash :size="12" /> {{ item.banSao?.maBanSao }}
                                        </span>
                                        <span
                                            class="inline-flex items-center gap-1 bg-yellow-100 border border-black px-1.5 py-0.5 text-xs font-mono font-bold"
                                        >
                                            {{ item.banSao?.sach?.namXuatBan }}
                                        </span>
                                    </div>
                                </div>
                            </td>

                            <td class="p-4 border-r-4 border-black align-top">
                                <div class="flex flex-col gap-2 text-sm font-bold">
                                    <div class="flex items-center gap-2">
                                        <CalendarDays :size="16" class="text-blue-600" />
                                        <span>Mượn: {{ formatDate(item.ngayMuon) }}</span>
                                    </div>

                                    <div
                                        v-if="item.ngayTra"
                                        class="flex items-center gap-2 text-green-700"
                                    >
                                        <CheckCircle :size="16" />
                                        <span>Trả: {{ formatDate(item.ngayTra) }}</span>
                                    </div>

                                    <div
                                        v-else-if="
                                            item.hanTra &&
                                            (item.trangThai === 'DANG_MUON' ||
                                                item.trangThai === 'DANG_CHO')
                                        "
                                        class="flex items-center gap-2"
                                    >
                                        <AlertCircle
                                            :size="16"
                                            :class="
                                                new Date() > new Date(item.hanTra)
                                                    ? 'text-red-600'
                                                    : 'text-gray-500'
                                            "
                                        />
                                        <span
                                            :class="
                                                new Date() > new Date(item.hanTra)
                                                    ? 'text-red-600'
                                                    : 'text-gray-500'
                                            "
                                        >
                                            Hạn: {{ formatDate(item.hanTra) }}
                                        </span>
                                    </div>
                                </div>
                            </td>

                            <td class="p-4 border-r-4 border-black align-middle text-center">
                                <div
                                    class="inline-flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[120px] transition-transform group-hover:scale-105"
                                    :class="getStatusBadge(item).class"
                                >
                                    <component
                                        :is="getStatusBadge(item).icon"
                                        :size="20"
                                        stroke-width="2.5"
                                    />
                                    <span class="text-xs font-black uppercase tracking-wider">{{
                                        getStatusBadge(item).text
                                    }}</span>
                                </div>
                            </td>

                            <td class="p-4 align-middle text-center">
                                <button
                                    v-if="item.trangThai === 'DANG_CHO'"
                                    @click="handleCancelClick(item)"
                                    class="w-12 h-12 flex items-center justify-center bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover:bg-red-100 hover:text-red-600 transition-all active:bg-red-200 mx-auto"
                                    title="Hủy yêu cầu"
                                >
                                    <Trash2 :size="24" stroke-width="2.5" />
                                </button>
                                <div
                                    v-else
                                    class="w-12 h-12 flex items-center justify-center mx-auto opacity-20 cursor-not-allowed"
                                >
                                    <Ban :size="24" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div
                v-if="!history || history.length === 0"
                class="p-16 text-center bg-gray-50 flex flex-col items-center justify-center gap-4"
            >
                <div
                    class="w-20 h-20 bg-white border-4 border-black rounded-full flex items-center justify-center shadow-neo"
                >
                    <Clock :size="40" class="text-gray-400" />
                </div>
                <h3 class="font-black text-2xl uppercase">Chưa có lịch sử</h3>
                <p class="font-medium text-gray-600 max-w-md">
                    Bạn chưa thực hiện giao dịch mượn sách nào. Hãy khám phá kho sách và đăng ký
                    mượn ngay!
                </p>
                <NeoButton @click="router.push('/portal/books')" variant="primary"
                    >Khám phá ngay</NeoButton
                >
            </div>
        </div>

        <NeoConfirmModal
            v-if="showConfirm"
            title="Hủy Yêu Cầu"
            description="Bạn có chắc chắn muốn hủy yêu cầu mượn sách này không? Hành động này không thể hoàn tác."
            variant="danger"
            :processing="isCancelling"
            @close="showConfirm = false"
            @confirm="confirmCancel"
        />
    </div>
</template>
