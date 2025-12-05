<script setup lang="ts">
import { ref, computed } from "vue";
import {
    Search,
    CheckCircle,
    XCircle,
    Clock,
    RotateCcw,
    MoreHorizontal,
    Ban,
    Phone,
    FilterX,
} from "lucide-vue-next";
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

// --- STATE ---
const searchQuery = ref("");
const statusFilter = ref("ALL");
const startDate = ref(""); // YYYY-MM-DD
const endDate = ref(""); // YYYY-MM-DD

const showConfirm = ref(false);
const selectedLoan = ref<TheoDoiMuonSach | null>(null);
const actionType = ref<"APPROVE" | "REJECT" | "RETURN">("APPROVE");

const statusOptions = [
    { value: "ALL", label: "Tất cả trạng thái" },
    { value: "DANG_CHO", label: "Chờ duyệt" },
    { value: "DANG_MUON", label: "Đang mượn" },
    { value: "DA_TRA", label: "Đã trả" },
    { value: "DA_TU_CHOI", label: "Đã từ chối" },
    { value: "DA_HUY", label: "Đã hủy" },
];

// --- ROBUST FILTER ENGINE ---
const filteredLoans = computed(() => {
    if (!loans.value) return [];

    return loans.value.filter((loan) => {
        // 1. OMNI-SEARCH (Case insensitive)
        const q = searchQuery.value.toLowerCase();
        // Checks: Loan Code, User Name, User ID, Book Name, Book Copy Code
        const matchesSearch =
            !q || // Pass if query is empty
            loan.maPhieuMuon.toLowerCase().includes(q) ||
            loan.docGia.ten.toLowerCase().includes(q) ||
            loan.docGia.maDocGia.toLowerCase().includes(q) ||
            loan.banSao.sach.tenSach.toLowerCase().includes(q) ||
            loan.banSao.maBanSao.toLowerCase().includes(q);

        // 2. STATUS FILTER
        const matchesStatus = statusFilter.value === "ALL" || loan.trangThai === statusFilter.value;

        // 3. DATE RANGE FILTER (Based on 'ngayMuon')
        let matchesDate = true;
        if (startDate.value || endDate.value) {
            const loanDate = new Date(loan.ngayMuon).setHours(0, 0, 0, 0);

            if (startDate.value) {
                const start = new Date(startDate.value).setHours(0, 0, 0, 0);
                if (loanDate < start) matchesDate = false;
            }
            if (endDate.value && matchesDate) {
                // Only check end if start passed
                const end = new Date(endDate.value).setHours(23, 59, 59, 999);
                if (loanDate > end) matchesDate = false;
            }
        }

        return matchesSearch && matchesStatus && matchesDate;
    });
});

const clearFilters = () => {
    searchQuery.value = "";
    statusFilter.value = "ALL";
    startDate.value = "";
    endDate.value = "";
};

// --- ACTIONS ---
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
            onError: (err) => {
                addToast({
                    title: "Lỗi",
                    description: err.message || "Không thể cập nhật trạng thái.",
                    variant: "error",
                });
            },
        },
    );
};

// --- UTILS ---
const formatDate = (date: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("vi-VN");
};

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
        case "DA_HUY":
            return {
                class: "bg-gray-100 text-gray-500 border-gray-300",
                label: "Đã hủy",
                icon: Ban,
            };
        default:
            return { class: "bg-gray-100", label: status, icon: MoreHorizontal };
    }
};
</script>

<template>
    <div class="space-y-6">
        <div
            class="bg-white p-4 border-4 border-black shadow-neo flex flex-col xl:flex-row gap-4 xl:items-end"
        >
            <div class="flex-1 min-w-[300px]">
                <label class="text-xs font-black uppercase mb-1 block">Tìm kiếm</label>
                <div class="relative w-full">
                    <Search class="absolute left-3 top-3 text-gray-500" :size="20" />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Mã phiếu, độc giả (tên/ID), mã sách..."
                        class="w-full pl-10 pr-4 py-2 bg-gray-50 border-2 border-black font-bold outline-none focus:shadow-neo-sm transition-all placeholder:font-normal"
                    />
                </div>
            </div>

            <div class="flex gap-2 w-full xl:w-auto">
                <div>
                    <label class="text-xs font-black uppercase mb-1 block">Từ ngày</label>
                    <div class="relative">
                        <input
                            v-model="startDate"
                            type="date"
                            class="pl-3 pr-2 py-2 bg-gray-50 border-2 border-black font-bold outline-none focus:shadow-neo-sm transition-all w-full xl:w-40"
                        />
                    </div>
                </div>
                <div>
                    <label class="text-xs font-black uppercase mb-1 block">Đến ngày</label>
                    <div class="relative">
                        <input
                            v-model="endDate"
                            type="date"
                            class="pl-3 pr-2 py-2 bg-gray-50 border-2 border-black font-bold outline-none focus:shadow-neo-sm transition-all w-full xl:w-40"
                        />
                    </div>
                </div>
            </div>

            <div class="w-full xl:w-56">
                <label class="text-xs font-black uppercase mb-1 block">Trạng Thái</label>
                <NeoSelect
                    id="status-filter"
                    :options="statusOptions"
                    v-model="statusFilter"
                    placeholder="Lọc trạng thái"
                />
            </div>

            <button
                v-if="searchQuery || statusFilter !== 'ALL' || startDate || endDate"
                @click="clearFilters"
                class="px-3 py-2 bg-gray-200 border-2 border-black font-bold hover:bg-gray-300 transition-colors h-[42px] flex items-center justify-center"
                title="Xóa bộ lọc"
            >
                <FilterX :size="20" />
            </button>
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
                        <th class="p-4 border-r-2 border-black font-black uppercase w-32">
                            Hạn / Trả
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
                        <td colspan="7" class="p-8 text-center font-bold">Đang tải dữ liệu...</td>
                    </tr>

                    <tr v-else-if="filteredLoans.length === 0">
                        <td colspan="7" class="p-12 text-center text-gray-500">
                            <div class="flex flex-col items-center gap-2">
                                <Search :size="32" class="opacity-50" />
                                <span class="font-bold">Không tìm thấy kết quả nào.</span>
                                <span class="text-sm"
                                    >Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</span
                                >
                            </div>
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
                            <p class="font-bold text-lg leading-tight">
                                {{ loan.docGia.hoLot }} {{ loan.docGia.ten }}
                            </p>
                            <div class="flex flex-col gap-0.5 mt-1">
                                <span
                                    class="text-xs bg-black text-white px-1 py-0.5 w-fit font-mono rounded-sm"
                                >
                                    ID: {{ loan.docGia.maDocGia }}
                                </span>
                                <span
                                    class="flex items-center gap-1 text-xs font-bold text-gray-600 mt-0.5"
                                >
                                    <Phone :size="10" /> {{ loan.docGia.soDienThoai }}
                                </span>
                            </div>
                        </td>

                        <td class="p-4 border-r-2 border-black">
                            <p class="font-bold text-sm leading-tight">
                                {{ loan.banSao.sach.tenSach }}
                            </p>
                            <p class="text-xs text-gray-500 font-mono mt-1">
                                Code:
                                <span class="font-bold text-black">{{ loan.banSao.maBanSao }}</span>
                            </p>
                        </td>

                        <td class="p-4 border-r-2 border-black font-medium text-sm">
                            {{ formatDate(loan.ngayMuon) }}
                        </td>

                        <td class="p-4 border-r-2 border-black font-medium text-sm">
                            <div v-if="loan.trangThai === 'DA_TRA' && loan.ngayTra">
                                <span class="block text-[10px] uppercase font-bold text-green-600"
                                    >Đã trả</span
                                >
                                <span class="font-bold">{{ formatDate(loan.ngayTra) }}</span>
                            </div>
                            <div v-else-if="['DANG_MUON', 'DANG_CHO'].includes(loan.trangThai)">
                                <span class="block text-[10px] uppercase font-bold text-gray-500"
                                    >Hạn trả</span
                                >
                                <span
                                    class="font-bold"
                                    :class="
                                        new Date() > new Date(loan.hanTra) ? 'text-red-600' : ''
                                    "
                                >
                                    {{ formatDate(loan.hanTra) }}
                                </span>
                            </div>
                            <span v-else class="text-gray-400 font-bold text-lg text-center block"
                                >-</span
                            >
                        </td>

                        <td class="p-4 border-r-2 border-black text-center">
                            <span
                                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border-2 uppercase whitespace-nowrap"
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
                                        class="p-2 bg-green-400 border-2 border-black shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all text-black rounded"
                                    >
                                        <CheckCircle :size="18" />
                                    </button>
                                    <button
                                        @click="handleAction(loan, 'REJECT')"
                                        class="p-2 bg-red-400 border-2 border-black shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all text-black rounded"
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
                                <span v-else class="text-gray-300"><MoreHorizontal /></span>
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
                      ? 'Từ chối yêu cầu mượn sách này?'
                      : 'Xác nhận độc giả đã trả sách?'
            "
            :variant="actionType === 'REJECT' ? 'danger' : 'info'"
            @close="showConfirm = false"
            @confirm="confirmAction"
        />
    </div>
</template>
