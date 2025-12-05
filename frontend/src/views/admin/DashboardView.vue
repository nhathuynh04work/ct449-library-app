<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Book, Users, Library, Bell, TrendingUp, Loader2 } from "lucide-vue-next";
import { getUserFromLocalStorage } from "@/lib/utils/getUserFromLocalStorage";
import type { NhanVien } from "@/types/models/NhanVien";
import { useDashboardStats } from "@/features/management/queries";

const currentUser = ref<NhanVien | null>(null);

// Fetch real stats from the backend
const { data: apiStats, isLoading } = useDashboardStats();

const stats = computed(() => [
    {
        label: "Tổng số Sách",
        value: apiStats.value?.totalBooks || 0,
        change: "Cuốn",
        color: "bg-blue-300",
        icon: Book,
    },
    {
        label: "Độc giả",
        value: apiStats.value?.totalReaders || 0,
        change: "Người",
        color: "bg-green-300",
        icon: Users,
    },
    {
        label: "Đang mượn",
        value: apiStats.value?.activeLoans || 0,
        change: "Phiếu",
        color: "bg-pink-300",
        icon: Library,
    },
    {
        label: "Yêu cầu mới",
        value: apiStats.value?.newRequests || 0,
        change: "Chờ duyệt",
        color: "bg-yellow-300",
        icon: Bell,
    },
]);

// Chart Data
const labels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const chartValues = ref([40, 30, 55, 45, 70, 65, 85]);
const maxChartValue = computed(() => Math.max(...chartValues.value, 100)); // Ensure at least 100 for scale

onMounted(() => {
    currentUser.value = getUserFromLocalStorage() as NhanVien;
});
</script>

<template>
    <div class="space-y-8 animate-in pt-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
                v-for="(stat, index) in stats"
                :key="index"
                class="bg-white border-4 border-black p-6 shadow-neo hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group"
            >
                <div class="flex justify-between items-start mb-4">
                    <div
                        :class="`p-3 border-2 border-black ${stat.color} shadow-neo-sm group-hover:rotate-6 transition-transform`"
                    >
                        <component :is="stat.icon" :size="24" stroke-width="2.5" />
                    </div>
                    <span class="font-black text-sm bg-black text-white px-2 py-0.5 rounded-full">
                        {{ stat.change }}
                    </span>
                </div>
                <h3 class="text-gray-600 font-bold text-sm uppercase tracking-wide">
                    {{ stat.label }}
                </h3>
                <div class="flex items-center gap-2 mt-1">
                    <Loader2 v-if="isLoading" class="animate-spin text-black" :size="24" />
                    <p v-else class="text-4xl font-black font-display">{{ stat.value }}</p>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 bg-white border-4 border-black p-6 shadow-neo flex flex-col">
                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-2xl font-black uppercase flex items-center gap-2">
                        <TrendingUp class="bg-yellow-300 border-2 border-black p-0.5" :size="28" />
                        Hoạt động tuần qua
                    </h2>
                </div>

                <div
                    class="flex-1 flex items-end justify-between gap-4 h-64 px-2 pb-2 border-b-2 border-gray-100"
                >
                    <div
                        v-for="(value, index) in chartValues"
                        :key="index"
                        class="w-full h-full flex flex-col justify-end items-center gap-2 group relative"
                    >
                        <div
                            class="opacity-0 group-hover:opacity-100 absolute -top-8 transition-opacity bg-black text-white text-xs font-bold px-2 py-1 pointer-events-none whitespace-nowrap z-10"
                        >
                            {{ value }} lượt
                        </div>

                        <div
                            class="w-full bg-blue-400 border-2 border-black relative transition-all duration-500 ease-out hover:bg-blue-300 shadow-neo-sm origin-bottom"
                            :style="{ height: `${(value / maxChartValue) * 100}%` }"
                        ></div>

                        <span class="font-bold text-sm text-gray-500">{{ labels[index] }}</span>
                    </div>
                </div>
            </div>

            <div class="bg-white border-4 border-black shadow-neo p-0 h-fit">
                <div
                    class="bg-red-400 p-4 border-b-4 border-black flex justify-between items-center"
                >
                    <h2 class="font-black text-white text-xl uppercase">Thông báo</h2>
                    <Bell :size="20" class="text-white" />
                </div>
                <div class="divide-y-4 divide-black">
                    <div class="p-4 bg-yellow-50 flex gap-3 items-start">
                        <div class="w-2 h-2 bg-red-500 rounded-full mt-2 shrink-0"></div>
                        <div>
                            <p class="font-bold text-sm">
                                Hệ thống <span class="font-normal">đã cập nhật số liệu</span>
                            </p>
                            <p class="text-xs font-bold text-gray-400 mt-1 uppercase">Vừa xong</p>
                        </div>
                    </div>
                    <div class="p-4 bg-white flex gap-3 items-start">
                        <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                        <div>
                            <p class="font-bold text-sm">
                                <span class="font-normal">Có 5 sách</span> sắp quá hạn trả
                            </p>
                            <p class="text-xs font-bold text-gray-400 mt-1 uppercase">
                                1 giờ trước
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-in {
    animation: animateIn 0.2s ease-out;
}
@keyframes animateIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
