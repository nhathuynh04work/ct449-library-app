<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { LayoutDashboard, Book, Users, Library, LogOut, Database, Settings } from "lucide-vue-next";
import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/vue";
import Logo from "@/assets/logo-icon-and-text.svg";
import { getUserFromLocalStorage } from "@/lib/utils/getUserFromLocalStorage";
import type { NhanVien } from "@/types/models/NhanVien";
import { useLoans } from "@/features/loans/queries";

const router = useRouter();
const route = useRoute();
const currentUser = ref<NhanVien | null>(null);
const showUserMenu = ref(false);

const reference = ref(null);
const floating = ref(null);
const { x, y, strategy } = useFloating(reference, floating, {
    placement: "bottom-end",
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
});

const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    const isOutside =
        reference.value &&
        !(reference.value as HTMLElement).contains(target) &&
        floating.value &&
        !(floating.value as HTMLElement).contains(target);

    if (isOutside) {
        showUserMenu.value = false;
    }
};

const { data: loans } = useLoans();

const pendingLoansCount = computed(() => {
    return loans.value?.filter((loan) => loan.trangThai === "DANG_CHO").length || 0;
});

const navItems = [
    { name: "admin-dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { name: "admin-books", label: "Sách", icon: Book },
    { name: "admin-resources", label: "Tài nguyên", icon: Database },
    { name: "admin-loans", label: "Mượn trả", icon: Library },
];

const isAdmin = computed(() => currentUser.value?.chucVu === "ADMIN");

const visibleNavItems = computed(() => {
    const items = [...navItems];

    // Show Readers for both Admin and Librarian
    if (isAdmin.value || currentUser.value?.chucVu === "LIBRARIAN") {
        items.push({ name: "admin-readers", label: "Độc giả", icon: Users });
    }

    // Only Admin sees Employees
    if (isAdmin.value) {
        items.push({ name: "admin-employees", label: "Nhân viên", icon: Settings });
    }
    return items;
});

onMounted(() => {
    currentUser.value = getUserFromLocalStorage() as NhanVien;
    document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
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
                            v-for="item in visibleNavItems"
                            :key="item.name"
                            @click="router.push({ name: item.name })"
                            class="px-4 py-2 font-bold border-2 border-transparent hover:border-black rounded-full transition-all flex items-center gap-2 text-sm uppercase tracking-wide relative"
                            :class="
                                isActive(item.name)
                                    ? 'bg-black text-white border-black shadow-neo-sm'
                                    : 'hover:bg-gray-100'
                            "
                        >
                            <component :is="item.icon" :size="18" />
                            {{ item.label }}

                            <span
                                v-if="item.name === 'admin-loans' && pendingLoansCount > 0"
                                class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm"
                            >
                                {{ pendingLoansCount }}
                            </span>
                        </button>
                    </nav>
                </div>

                <div class="flex items-center gap-4">
                    <button
                        ref="reference"
                        @click="showUserMenu = !showUserMenu"
                        class="flex items-center gap-3 bg-yellow-300 border-2 border-black px-1 pr-4 py-1 shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:bg-yellow-400"
                    >
                        <div
                            class="w-8 h-8 bg-black text-white flex items-center justify-center font-bold border border-black"
                        >
                            {{ currentUser?.ten?.charAt(0) || "A" }}
                        </div>
                        <div class="flex flex-col items-start leading-none">
                            <span class="font-bold hidden sm:block truncate max-w-[100px]">
                                {{ currentUser?.ten || "Admin" }}
                            </span>
                            <span
                                class="text-[10px] font-bold uppercase text-gray-600 hidden sm:block"
                            >
                                {{ currentUser?.chucVu || "Staff" }}
                            </span>
                        </div>
                    </button>

                    <Teleport to="body">
                        <div
                            v-if="showUserMenu"
                            ref="floating"
                            class="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-2 z-[9999] min-w-[200px]"
                            :style="{
                                position: strategy,
                                top: `${y ?? 0}px`,
                                left: `${x ?? 0}px`,
                            }"
                        >
                            <div class="px-2 py-2 border-b-2 border-gray-100 mb-2">
                                <p class="text-xs font-bold text-gray-500 uppercase">
                                    Đang đăng nhập
                                </p>
                                <p class="font-bold text-purple-600 truncate">
                                    {{ currentUser?.hoLot }} {{ currentUser?.ten }}
                                </p>
                            </div>
                            <button
                                class="w-full text-left px-2 py-2 hover:bg-gray-100 font-bold flex items-center gap-2 transition-colors"
                            >
                                <Settings :size="16" /> Cài đặt
                            </button>
                            <button
                                @click="handleLogout"
                                class="w-full text-left px-2 py-2 hover:bg-red-100 text-red-600 font-bold flex items-center gap-2 mt-1 transition-colors"
                            >
                                <LogOut :size="16" /> Đăng xuất
                            </button>
                        </div>
                    </Teleport>
                </div>
            </div>
        </header>

        <div
            class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black z-40 px-4 py-3 flex justify-between shadow-[0_-4px_0_rgba(0,0,0,0.1)]"
        >
            <button
                v-for="item in visibleNavItems"
                :key="item.name"
                @click="router.push({ name: item.name })"
                class="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors relative"
                :class="isActive(item.name) ? 'text-purple-600 bg-purple-50' : 'text-gray-500'"
            >
                <component :is="item.icon" :size="24" :stroke-width="isActive(item.name) ? 3 : 2" />
                <span class="text-[10px] font-bold uppercase">{{ item.label }}</span>

                <span
                    v-if="item.name === 'admin-loans' && pendingLoansCount > 0"
                    class="absolute top-1 right-2 bg-red-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white"
                >
                    {{ pendingLoansCount }}
                </span>
            </button>
        </div>

        <main
            class="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12 mb-20 md:mb-0 relative z-10"
        >
            <RouterView />
        </main>
    </div>
</template>

<style scoped></style>
