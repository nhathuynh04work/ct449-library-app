<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { LogOut, Clock, LogIn, UserPlus } from "lucide-vue-next";
import Logo from "@/assets/logo-icon-and-text.svg";
import { getUserFromLocalStorage } from "@/lib/utils/getUserFromLocalStorage";
import type { DocGia } from "@/types/models/DocGia";

const router = useRouter();
const currentUser = ref<DocGia | null>(null);

onMounted(() => {
    currentUser.value = getUserFromLocalStorage() as DocGia;
});

const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload(); // Simple reload to clear state and re-check
};

const goToHistory = () => {
    router.push("/portal/history");
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 font-body flex flex-col relative">
        <div
            class="absolute inset-0 z-0 pointer-events-none opacity-20"
            style="
                background-image: radial-gradient(#000 1px, transparent 1px);
                background-size: 24px 24px;
            "
        ></div>

        <header class="bg-white border-b-4 border-black sticky top-0 z-50 shadow-neo px-6 py-3">
            <div
                class="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4"
            >
                <div
                    class="flex items-center gap-2 cursor-pointer"
                    @click="router.push('/portal/books')"
                >
                    <img
                        :src="Logo"
                        alt="Storism"
                        class="h-10 hover:-rotate-2 transition-transform"
                    />
                </div>

                <div class="flex items-center gap-4 w-full md:w-auto justify-end">
                    <template v-if="currentUser">
                        <div
                            class="flex items-center gap-3 bg-yellow-100 border-2 border-black px-3 py-1.5 shadow-neo-sm"
                        >
                            <div
                                class="w-8 h-8 bg-black text-white flex items-center justify-center font-bold border border-black rounded-full"
                            >
                                {{ currentUser.ten?.charAt(0) || "U" }}
                            </div>
                            <div class="text-sm">
                                <p class="font-bold leading-none">{{ currentUser.ten }}</p>
                                <p class="text-xs text-gray-500 uppercase font-bold">
                                    {{ currentUser.maDocGia }}
                                </p>
                            </div>
                        </div>

                        <button
                            @click="goToHistory"
                            class="bg-white p-2 border-2 border-black shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all mr-2 text-blue-600"
                            title="Lịch sử mượn"
                        >
                            <Clock :size="20" />
                        </button>

                        <button
                            @click="handleLogout"
                            class="bg-white p-2 border-2 border-black shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all text-red-500"
                            title="Đăng xuất"
                        >
                            <LogOut :size="20" />
                        </button>
                    </template>

                    <template v-else>
                        <router-link
                            to="/login"
                            class="px-4 py-2 font-bold border-2 border-black bg-white hover:bg-gray-100 transition-colors flex items-center gap-2"
                        >
                            <LogIn :size="18" /> Đăng nhập
                        </router-link>
                        <router-link
                            to="/register"
                            class="px-4 py-2 font-bold border-2 border-black bg-yellow-400 shadow-neo-sm hover:bg-yellow-500 transition-colors flex items-center gap-2"
                        >
                            <UserPlus :size="18" /> Đăng ký
                        </router-link>
                    </template>
                </div>
            </div>
        </header>

        <main class="container mx-auto p-6 relative z-10 flex-1">
            <RouterView />
        </main>
    </div>
</template>
