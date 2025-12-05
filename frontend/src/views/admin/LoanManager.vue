<script setup lang="ts">
import { ref, computed } from "vue";
import { Search, CheckCircle, XCircle, Clock, RotateCcw, MoreHorizontal } from "lucide-vue-next";
import NeoButton from "@/components/ui/NeoButton.vue";
import NeoSelect from "@/components/ui/NeoSelect.vue";
import { useLoans } from "@/features/loans/queries";
import { useUpdateLoanStatus } from "@/features/loans/mutations";
import { useToast } from "@/composables/useToast";
import NeoConfirmModal from "@/components/ui/NeoConfirmModal.vue";
import type { TheoDoiMuonSach } from "@/types/models/TheoDoiMuonSach";

const { data: loans, isLoading } = useLoans();
const { mutate: updateStatus } = useUpdateLoanStatus();
const { addToast } = useToast();

const searchQuery = ref("");
const statusFilter = ref("ALL");
const showConfirm = ref(false);
const selectedLoan = ref<TheoDoiMuonSach | null>(null);
const actionType = ref<"APPROVE" | "REJECT" | "RETURN">("APPROVE");

const statusOptions = [
    { value: "ALL", label: "Tất cả trạng thái" },
    { value: "DANG_CHO", label: "Chờ duyệt" },
    { value: "DANG_MUON", label: "Đang mượn" },
    { value: "DA_TRA", label: "Đã trả" },
    { value: "DA_TU_CHOI", label: "Đã từ chối" },
];

const filteredLoans = computed(() => {
    if (!loans.value) return [];

    return loans.value.filter((loan) => {
        const matchesSearch =
            loan.maPhieuMuon.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            loan.docGia.ten.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            loan.docGia.maDocGia.toLowerCase().includes(searchQuery.value.toLowerCase());

        const matchesStatus = statusFilter.value === "ALL" || loan.trangThai === statusFilter.value;
        return matchesSearch && matchesStatus;
    });
});

const handleAction = (loan: TheoDoiMuonSach, action: "APPROVE" | "REJECT" | "RETURN") => {
    selectedLoan.value = loan;
    actionType.value = action;
    showConfirm.value = true;
};

const confirmAction = () => {
    if (!selectedLoan.value) return;

    let newStatus = "";
    if (actionType.value === "APPROVE") newStatus = "DANG_MUON";
    else if (actionType.value === "REJECT") newStatus = "DA_TU_CHOI";
    else if (actionType.value === "RETURN") newStatus = "DA_TRA";

    updateStatus(
        { id: selectedLoan.value._id, status: newStatus },
        {
            onSuccess: () => {
                addToast({
                    title: "Thành công",
                    description: "Đã cập nhật trạng thái phiếu mượn.",
                    variant: "success",
                });
                showConfirm.value = false;
                selectedLoan.value = null;
            },
            onError: () => {
                addToast({
                    title: "Lỗi",
                    description: "Không thể cập nhật trạng thái.",
                    variant: "error",
                });
            },
        },
    );
};

const formatDate = (date: string) => new Date(date).toLocaleDateString("vi-VN");

const getStatusBadge = (status: string) => {
    switch (status) {
        case "DANG_CHO":
            return {
                class: "bg-yellow-100 text-yellow-800 border-yellow-300",
                label: "Chờ duyệt",
                icon: Clock,
            };
        case "DANG_MUON":
            return {
                class: "bg-blue-100 text-blue-800 border-blue-300",
                label: "Đang mượn",
                icon: CheckCircle,
            };
        case "DA_TRA":
            return {
                class: "bg-green-100 text-green-800 border-green-300",
                label: "Đã trả",
                icon: RotateCcw,
            };
        case "DA_TU_CHOI":
            return {
                class: "bg-red-100 text-red-800 border-red-300",
                label: "Đã từ chối",
                icon: XCircle,
            };
        default:
            return { class: "bg-gray-100", label: status, icon: MoreHorizontal };
    }
};
</script>

<template>
    <div class="space-y-6">
        <div
            class="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 border-4 border-black shadow-neo"
        >
            <div class="flex items-center gap-2 w-full md:w-auto">
                <div class="relative w-full md:w-80">
                    <Search class="absolute left-3 top-3 text-gray-500" :size="20" />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Mã phiếu, tên độc giả..."
                        class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-black font-bold outline-none focus:shadow-neo-sm transition-all"
                    />
                </div>
            </div>

            <div class="w-full md:w-64">
                <NeoSelect
                    id="status-filter"
                    :options="statusOptions"
                    v-model="statusFilter"
                    placeholder="Lọc theo trạng thái"
                />
            </div>
        </div>

        <div class="bg-white border-4 border-black shadow-neo overflow-hidden min-h-[400px]">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-purple-200 border-b-4 border-black text-black">
                        <th class="p-4 border-r-2 border-black font-black uppercase w-28">
                            Mã Phiếu
                        </th>
                        <th class="p-4 border-r-2 border-black font-black uppercase">Độc Giả</th>
                        <th class="p-4 border-r-2 border-black font-black uppercase">Sách Mượn</th>
                        <th class="p-4 border-r-2 border-black font-black uppercase w-32">
                            Ngày Mượn
                        </th>
                        <th
                            class="p-4 border-r-2 border-black font-black uppercase w-40 text-center"
                        >
                            Trạng Thái
                        </th>
                        <th class="p-4 font-black uppercase w-48 text-center">Hành Động</th>
                    </tr>
                </thead>
                <tbody class="divide-y-2 divide-black">
                    <tr v-if="isLoading">
                        <td colspan="6" class="p-8 text-center font-bold">Đang tải dữ liệu...</td>
                    </tr>
                    <tr v-else-if="filteredLoans.length === 0">
                        <td colspan="6" class="p-8 text-center text-gray-500 font-bold">
                            Không tìm thấy phiếu mượn nào.
                        </td>
                    </tr>
                    <tr
                        v-for="loan in filteredLoans"
                        :key="loan._id"
                        class="hover:bg-purple-50 transition-colors"
                    >
                        <td class="p-4 border-r-2 border-black font-mono font-bold">
                            {{ loan.maPhieuMuon }}
                        </td>
                        <td class="p-4 border-r-2 border-black">
                            <p class="font-bold">{{ loan.docGia.hoLot }} {{ loan.docGia.ten }}</p>
                            <p class="text-xs text-gray-500 font-mono">
                                {{ loan.docGia.maDocGia }}
                            </p>
                        </td>
                        <td class="p-4 border-r-2 border-black">
                            <p class="font-bold text-sm">{{ loan.banSao.sach.tenSach }}</p>
                            <p class="text-xs text-gray-500 font-mono">
                                Bản sao: {{ loan.banSao.maBanSao }}
                            </p>
                        </td>
                        <td class="p-4 border-r-2 border-black font-medium text-sm">
                            {{ formatDate(loan.ngayMuon) }}
                            <div v-if="loan.ngayTra" class="text-xs text-green-600 mt-1">
                                Trả: {{ formatDate(loan.ngayTra) }}
                            </div>
                        </td>
                        <td class="p-4 border-r-2 border-black text-center">
                            <span
                                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border-2 uppercase"
                                :class="getStatusBadge(loan.trangThai).class"
                            >
                                <component :is="getStatusBadge(loan.trangThai).icon" :size="14" />
                                {{ getStatusBadge(loan.trangThai).label }}
                            </span>
                        </td>
                        <td class="p-4 text-center">
                            <div class="flex justify-center gap-2">
                                <template v-if="loan.trangThai === 'DANG_CHO'">
                                    <button
                                        @click="handleAction(loan, 'APPROVE')"
                                        class="p-2 bg-green-400 border-2 border-black shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all text-black"
                                        title="Duyệt"
                                    >
                                        <CheckCircle :size="18" />
                                    </button>
                                    <button
                                        @click="handleAction(loan, 'REJECT')"
                                        class="p-2 bg-red-400 border-2 border-black shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all text-black"
                                        title="Từ chối"
                                    >
                                        <XCircle :size="18" />
                                    </button>
                                </template>
                                <template v-else-if="loan.trangThai === 'DANG_MUON'">
                                    <NeoButton
                                        @click="handleAction(loan, 'RETURN')"
                                        variant="secondary"
                                        class="py-1 px-3 text-xs flex items-center gap-1"
                                    >
                                        <RotateCcw :size="14" /> Trả Sách
                                    </NeoButton>
                                </template>
                                <span v-else class="text-gray-400 font-bold text-sm">—</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <NeoConfirmModal
            v-if="showConfirm"
            :title="
                actionType === 'APPROVE'
                    ? 'Duyệt Mượn Sách'
                    : actionType === 'REJECT'
                      ? 'Từ Chối Mượn'
                      : 'Xác Nhận Trả Sách'
            "
            :description="
                actionType === 'APPROVE'
                    ? 'Xác nhận cho độc giả mượn cuốn sách này?'
                    : actionType === 'REJECT'
                      ? 'Từ chối yêu cầu mượn sách này? Sách sẽ được mở lại kho.'
                      : 'Xác nhận độc giả đã trả sách? Sách sẽ được cập nhật trạng thái có sẵn.'
            "
            :variant="actionType === 'REJECT' ? 'danger' : 'info'"
            @close="showConfirm = false"
            @confirm="confirmAction"
        />
    </div>
</template>
