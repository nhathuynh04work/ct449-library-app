<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { User, Library, ArrowRight } from "lucide-vue-next";
import NeoInput from "@/components/ui/NeoInput.vue";
import NeoButton from "@/components/ui/NeoButton.vue";
import Logo from "@/assets/logo-icon-and-text.svg";
import { useLogin } from "@/features/auth/mutations";
import { useToast } from "@/composables/useToast";

const router = useRouter();
const { mutate, isPending, error } = useLogin();

const userType = ref<"READER" | "STAFF">("READER");
const identifier = ref("");
const password = ref("");
const { addToast } = useToast();

const handleLogin = () => {
    mutate(
        {
            type: userType.value,
            payload: { identifier: identifier.value, password: password.value },
        },
        {
            onSuccess: () => {
                if (userType.value === "READER") {
                    router.push("/portal/books");
                } else {
                    router.push("/admin/dashboard");
                }
            },
            onError: (err) => {
                addToast({
                    title: "Lỗi Đăng Nhập",
                    description: err.message || "Vui lòng kiểm tra lại thông tin.",
                    variant: "error",
                });
            },
        },
    );
};
</script>

<template>
    <div class="min-h-screen flex flex-col md:flex-row bg-white">
        <div
            class="md:w-1/2 bg-yellow-400 border-b-4 md:border-b-0 md:border-r-4 border-black p-10 flex flex-col justify-between relative overflow-hidden"
        >
            <div
                class="absolute top-10 right-10 w-20 h-20 bg-purple-400 border-4 border-black rounded-full"
            ></div>
            <div
                class="absolute bottom-20 left-10 w-32 h-32 bg-green-400 border-4 border-black rotate-12"
            ></div>

            <div class="z-10">
                <img :src="Logo" alt="Storism Logo" class="h-16 mb-6" />
                <h1 class="text-6xl font-black uppercase leading-tight mb-4">
                    Hệ thống<br />Quản lý<br />Thư viện
                </h1>
                <p
                    class="text-xl font-bold font-mono bg-white inline-block px-2 border-2 border-black shadow-neo-sm"
                >
                    Phiên bản v1.0
                </p>
            </div>

            <div class="z-10 mt-10 md:mt-0">
                <p class="font-bold mb-2">Chưa có tài khoản?</p>
                <RouterLink to="/register">
                    <NeoButton variant="secondary" class="flex items-center gap-2">
                        Đăng ký thẻ thư viện <ArrowRight :size="20" />
                    </NeoButton>
                </RouterLink>
            </div>
        </div>

        <div class="md:w-1/2 flex items-center justify-center p-8 bg-purple-50">
            <div class="w-full max-w-md">
                <h2 class="text-3xl font-black mb-8 border-b-4 border-black pb-2 inline-block">
                    ĐĂNG NHẬP
                </h2>

                <div class="flex border-4 border-black p-1 mb-8 bg-white shadow-neo">
                    <button
                        @click="userType = 'READER'"
                        class="flex-1 flex items-center justify-center gap-2 py-3 font-bold transition-all border-2"
                        :class="
                            userType === 'READER'
                                ? 'bg-blue-400 border-black text-black'
                                : 'border-transparent text-gray-400 hover:text-black'
                        "
                    >
                        <User :size="24" /> Độc giả
                    </button>
                    <div class="w-1 bg-black mx-1"></div>
                    <button
                        @click="userType = 'STAFF'"
                        class="flex-1 flex items-center justify-center gap-2 py-3 font-bold transition-all border-2"
                        :class="
                            userType === 'STAFF'
                                ? 'bg-orange-400 border-black text-black'
                                : 'border-transparent text-gray-400 hover:text-black'
                        "
                    >
                        <Library :size="24" /> Nhân viên
                    </button>
                </div>

                <form @submit.prevent="handleLogin" class="flex flex-col gap-6">
                    <NeoInput
                        id="identity"
                        :label="userType === 'READER' ? 'Mã số Độc giả' : 'Mã số Nhân viên'"
                        v-model="identifier"
                        :placeholder="userType === 'READER' ? 'VD: DG000001' : 'VD: NV000001'"
                    />

                    <NeoInput
                        id="password"
                        label="Mật khẩu"
                        type="password"
                        v-model="password"
                        placeholder="••••••••"
                    />

                    <div
                        v-if="error"
                        class="bg-red-100 border-2 border-red-500 text-red-600 p-3 font-bold text-sm"
                    >
                        {{ error.message || "Đăng nhập thất bại" }}
                    </div>

                    <NeoButton
                        class="w-full mt-4 text-xl py-4"
                        variant="primary"
                        :disabled="isPending"
                    >
                        {{ isPending ? "ĐANG XỬ LÝ..." : "TRUY CẬP HỆ THỐNG" }}
                    </NeoButton>
                </form>
            </div>
        </div>
    </div>
</template>
