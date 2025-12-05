<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { LayoutDashboard, Book, Library, LogOut, Database, Settings } from "lucide-vue-next";
import Logo from "@/assets/logo-icon-and-text.svg";
import { getUserFromLocalStorage } from "@/lib/utils/getUserFromLocalStorage";
import type { NhanVien } from "@/types/models/NhanVien";

const router = useRouter();
const route = useRoute();
const currentUser = ref<NhanVien | null>(null);
const showUserMenu = ref(false);

const navItems = [
    { name: "admin-dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { name: "admin-books", label: "Sách", icon: Book },
    { name: "admin-resources", label: "Tài nguyên", icon: Database },
    { name: "admin-loans", label: "Mượn trả", icon: Library },
];

onMounted(() => {
    currentUser.value = getUserFromLocalStorage() as NhanVien;
});

const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
};

const isActive = (routeName: string) => route.name === routeName;
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
                            :key="item.name"
                            @click="router.push({ name: item.name })"
                            class="px-4 py-2 font-bold border-2 border-transparent hover:border-black rounded-full transition-all flex items-center gap-2 text-sm uppercase tracking-wide"
                            :class="
                                isActive(item.name)
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
                            class="absolute right-0 top-full mt-2 w-48 bg-white border-4 border-black shadow-neo p-2 z-50 animate-in"
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
                :key="item.name"
                @click="router.push({ name: item.name })"
                class="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
                :class="isActive(item.name) ? 'text-purple-600 bg-purple-50' : 'text-gray-500'"
            >
                <component :is="item.icon" :size="24" :stroke-width="isActive(item.name) ? 3 : 2" />
                <span class="text-[10px] font-bold uppercase">{{ item.label }}</span>
            </button>
        </div>

        <main
            class="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12 mb-20 md:mb-0 relative z-10"
        >
            <RouterView />
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
</style>
