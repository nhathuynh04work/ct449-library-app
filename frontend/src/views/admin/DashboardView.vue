<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Book, Users, Library, Bell, Plus, ArrowUpRight } from "lucide-vue-next";
import NeoButton from "@/components/ui/NeoButton.vue";
import { getUserFromLocalStorage } from "@/lib/utils/getUserFromLocalStorage";
import type { NhanVien } from "@/types/models/NhanVien";

const currentUser = ref<NhanVien | null>(null);

const stats = [
    { label: "Tổng số Sách", value: "1,240", change: "+12%", color: "bg-blue-300", icon: Book },
    { label: "Độc giả", value: "850", change: "+5%", color: "bg-green-300", icon: Users },
    { label: "Lượt mượn", value: "124", change: "+18%", color: "bg-pink-300", icon: Library },
    { label: "Yêu cầu mới", value: "12", change: "Mới", color: "bg-yellow-300", icon: Bell },
];

onMounted(() => {
    currentUser.value = getUserFromLocalStorage() as NhanVien;
});
</script>

<template>
    <div class="space-y-10 animate-in">
        <div
            class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-4 border-black pb-6 bg-white p-6 shadow-neo"
        >
            <div>
                <h1
                    class="text-4xl md:text-5xl font-black font-display uppercase italic transform -skew-x-6"
                >
                    Dashboard
                </h1>
                <p class="font-bold text-gray-500 mt-2 text-lg">
                    Chào mừng trở lại,
                    <span class="bg-black text-white px-2">{{ currentUser?.ten }}</span>
                </p>
            </div>
            <div class="flex gap-3">
                <NeoButton variant="secondary" class="text-sm">Báo cáo tuần</NeoButton>
                <NeoButton class="text-sm flex items-center gap-2">
                    <Plus :size="18" /> Thêm mới
                </NeoButton>
            </div>
        </div>

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
                <p class="text-4xl font-black font-display mt-1">{{ stat.value }}</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-8">
                <div class="bg-purple-100 border-4 border-black p-6 shadow-neo">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-black uppercase flex items-center gap-2">
                            <ArrowUpRight class="bg-white border-2 border-black p-0.5" :size="28" />
                            Truy cập nhanh
                        </h2>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <button
                            class="bg-white p-4 border-2 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-left group"
                        >
                            <div
                                class="mb-3 bg-blue-200 w-10 h-10 flex items-center justify-center border-2 border-black group-hover:scale-110 transition-transform"
                            >
                                <Book :size="20" />
                            </div>
                            <span class="font-bold block">Thêm sách mới</span>
                        </button>
                        <button
                            class="bg-white p-4 border-2 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-left group"
                        >
                            <div
                                class="mb-3 bg-green-200 w-10 h-10 flex items-center justify-center border-2 border-black group-hover:scale-110 transition-transform"
                            >
                                <Users :size="20" />
                            </div>
                            <span class="font-bold block">Đăng ký độc giả</span>
                        </button>
                        <button
                            class="bg-white p-4 border-2 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-left group"
                        >
                            <div
                                class="mb-3 bg-yellow-200 w-10 h-10 flex items-center justify-center border-2 border-black group-hover:scale-110 transition-transform"
                            >
                                <Library :size="20" />
                            </div>
                            <span class="font-bold block">Tạo phiếu mượn</span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="bg-white border-4 border-black shadow-neo p-0 h-fit">
                <div
                    class="bg-red-400 p-4 border-b-4 border-black flex justify-between items-center"
                >
                    <h2 class="font-black text-white text-xl uppercase">Hoạt động</h2>
                    <Bell :size="20" class="text-white" />
                </div>
                <div class="divide-y-4 divide-black">
                    <div class="p-4 bg-yellow-50 flex gap-3 items-start">
                        <div class="w-2 h-2 bg-red-500 rounded-full mt-2 shrink-0"></div>
                        <div>
                            <p class="font-bold text-sm">
                                Nguyễn Văn A <span class="font-normal">vừa trả sách</span> "Clean
                                Code"
                            </p>
                            <p class="text-xs font-bold text-gray-400 mt-1 uppercase">
                                2 phút trước
                            </p>
                        </div>
                    </div>
                    <div class="p-4 bg-white flex gap-3 items-start">
                        <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                        <div>
                            <p class="font-bold text-sm">
                                Trần Thị B <span class="font-normal">đăng ký thành viên mới</span>
                            </p>
                            <p class="text-xs font-bold text-gray-400 mt-1 uppercase">
                                15 phút trước
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
