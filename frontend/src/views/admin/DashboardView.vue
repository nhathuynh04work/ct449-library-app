<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
    LayoutDashboard,
    Book,
    Users,
    Library,
    LogOut,
    Bell,
    Plus,
    // Search,
    ArrowUpRight,
    Settings,
    Database,
} from "lucide-vue-next";
import NeoButton from "@/components/ui/NeoButton.vue";
import Logo from "@/assets/logo-icon-and-text.svg";
import { getUserFromLocalStorage } from "@/lib/utils/getUserFromLocalStorage";
import BookManager from "./BookManager.vue";
import ResourceManager from "./ResourceManager.vue";
import LoanManager from "./LoanManager.vue";

const router = useRouter();
const activeTab = ref("overview");
const currentUser = ref(null);
const showUserMenu = ref(false);

// Stat Cards Data
const stats = [
    { label: "Tổng số Sách", value: "1,240", change: "+12%", color: "bg-blue-300", icon: Book },
    { label: "Độc giả", value: "850", change: "+5%", color: "bg-green-300", icon: Users },
    { label: "Lượt mượn", value: "124", change: "+18%", color: "bg-pink-300", icon: Library },
    { label: "Yêu cầu mới", value: "12", change: "Mới", color: "bg-yellow-300", icon: Bell },
];

// Navigation Items
const navItems = [
    { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
    { id: "books", label: "Sách", icon: Book },
    { id: "resources", label: "Tài nguyên", icon: Database },
    { id: "readers", label: "Độc giả", icon: Users },
    { id: "loans", label: "Mượn trả", icon: Library },
];

onMounted(() => {
    currentUser.value = getUserFromLocalStorage();
});

const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 font-body flex flex-col">
        <div
            class="fixed inset-0 z-0 pointer-events-none opacity-30"
            style="
                background-image: radial-gradient(#000 1px, transparent 1px);
                background-size: 24px 24px;
            "
        ></div>

        <header class="sticky top-0 z-50 bg-white border-b-4 border-black shadow-neo">
            <div class="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                <div class="flex items-center gap-6">
                    <img
                        :src="Logo"
                        alt="Storism"
                        class="h-10 md:h-12 hover:-rotate-2 transition-transform"
                    />

                    <nav class="hidden md:flex items-center gap-2 ml-4">
                        <button
                            v-for="item in navItems"
                            :key="item.id"
                            @click="activeTab = item.id"
                            class="px-4 py-2 font-bold border-2 border-transparent hover:border-black rounded-full transition-all flex items-center gap-2 text-sm uppercase tracking-wide"
                            :class="
                                activeTab === item.id
                                    ? 'bg-black text-white border-black shadow-neo-sm'
                                    : 'hover:bg-gray-100'
                            "
                        >
                            <component :is="item.icon" :size="18" />
                            {{ item.label }}
                        </button>
                    </nav>
                </div>

                <div class="flex items-center gap-4">
                    <div class="relative">
                        <button
                            @click="showUserMenu = !showUserMenu"
                            class="flex items-center gap-3 bg-yellow-300 border-2 border-black px-1 pr-4 py-1 shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:bg-yellow-400"
                        >
                            <div
                                class="w-8 h-8 bg-black text-white flex items-center justify-center font-bold border border-black"
                            >
                                {{ currentUser?.ten?.charAt(0) || "A" }}
                            </div>
                            <span class="font-bold hidden sm:block truncate max-w-[100px]">
                                {{ currentUser?.ten || "Admin" }}
                            </span>
                        </button>

                        <div
                            v-if="showUserMenu"
                            class="absolute right-0 top-full mt-2 w-48 bg-white border-4 border-black shadow-neo p-2 z-50 animate-in fade-in slide-in-from-top-2"
                        >
                            <div class="px-2 py-2 border-b-2 border-gray-100 mb-2">
                                <p class="text-xs font-bold text-gray-500 uppercase">Vai trò</p>
                                <p class="font-bold text-purple-600">
                                    {{ currentUser?.chucVu || "Staff" }}
                                </p>
                            </div>
                            <button
                                class="w-full text-left px-2 py-2 hover:bg-gray-100 font-bold flex items-center gap-2"
                            >
                                <Settings :size="16" /> Cài đặt
                            </button>
                            <button
                                @click="handleLogout"
                                class="w-full text-left px-2 py-2 hover:bg-red-100 text-red-600 font-bold flex items-center gap-2 mt-1"
                            >
                                <LogOut :size="16" /> Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <div
            class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black z-40 px-4 py-3 flex justify-between shadow-[0_-4px_0_rgba(0,0,0,0.1)]"
        >
            <button
                v-for="item in navItems"
                :key="item.id"
                @click="activeTab = item.id"
                class="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
                :class="activeTab === item.id ? 'text-purple-600 bg-purple-50' : 'text-gray-500'"
            >
                <component
                    :is="item.icon"
                    :size="24"
                    :stroke-width="activeTab === item.id ? 3 : 2"
                />
                <span class="text-[10px] font-bold uppercase">{{ item.label }}</span>
            </button>
        </div>

        <main
            class="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12 mb-20 md:mb-0 relative z-10"
        >
            <div v-if="activeTab === 'overview'" class="space-y-10">
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
                            <span
                                class="font-black text-sm bg-black text-white px-2 py-0.5 rounded-full"
                            >
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
                                    <ArrowUpRight
                                        class="bg-white border-2 border-black p-0.5"
                                        :size="28"
                                    />
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
                                        Nguyễn Văn A
                                        <span class="font-normal">vừa trả sách</span> "Clean Code"
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
                                        Trần Thị B
                                        <span class="font-normal">đăng ký thành viên mới</span>
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

            <div v-else-if="activeTab === 'books'" class="animate-in">
                <BookManager />
            </div>

            <div v-else-if="activeTab === 'resources'" class="animate-in">
                <ResourceManager />
            </div>

            <div v-else-if="activeTab === 'loans'" class="animate-in">
                <LoanManager />
            </div>

            <div
                v-else
                class="flex flex-col items-center justify-center min-h-[60vh] bg-white border-4 border-black shadow-neo p-8 text-center"
            >
                <div
                    class="w-32 h-32 bg-gray-100 rounded-full border-4 border-black flex items-center justify-center mb-6 relative"
                >
                    <Settings :size="64" class="animate-spin-slow text-gray-400" />
                    <div
                        class="absolute -bottom-2 -right-2 bg-yellow-400 border-2 border-black px-2 py-1 text-xs font-bold"
                    >
                        WIP
                    </div>
                </div>
                <h2 class="text-3xl font-black uppercase mb-3">Tính năng đang phát triển</h2>
                <p class="font-medium text-gray-500 max-w-md mb-8">
                    Trang quản lý
                    <span class="font-bold text-black">{{
                        navItems.find((i) => i.id === activeTab)?.label
                    }}</span>
                    đang được xây dựng. Vui lòng quay lại sau!
                </p>
                <NeoButton variant="primary" @click="activeTab = 'overview'">
                    Quay về Dashboard
                </NeoButton>
            </div>
        </main>
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

.animate-spin-slow {
    animation: spin 8s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
