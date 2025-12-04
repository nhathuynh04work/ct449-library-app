<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft, CheckCircle, Copy, ArrowRight } from "lucide-vue-next";
import NeoInput from "@/components/ui/NeoInput.vue";
import NeoButton from "@/components/ui/NeoButton.vue";
import NeoSelect from "@/components/ui/NeoSelect.vue";
import { useRegister } from "@/features/auth/mutations";
import { useToast } from "@/composables/useToast";
import type { RegisterPayload } from "@/features/auth/types";

const router = useRouter();
const { mutate, isPending, error } = useRegister();
const { addToast } = useToast();

const showSuccessModal = ref(false);
const createdReaderId = ref("");

const genderOptions = [
    { value: "Nam", label: "Nam" },
    { value: "Nữ", label: "Nữ" },
    { value: "Khác", label: "Khác" },
];

const form = ref({
    hoLot: "",
    ten: "",
    ngaySinh: "",
    gioiTinh: "Nam",
    soDienThoai: "",
    diaChi: "",
    matKhau: "",
});

const handleRegister = () => {
    mutate(form.value as RegisterPayload, {
        onSuccess: (data) => {
            createdReaderId.value = data.maDocGia;
            showSuccessModal.value = true;
        },
        onError: (err) => {
            addToast({
                title: "Lỗi",
                description: err.message || "Đăng ký thất bại",
                variant: "error",
            });
        },
    });
};

const copyId = () => {
    navigator.clipboard.writeText(createdReaderId.value);
    addToast({
        title: "Đã sao chép",
        description: "Mã độc giả đã được lưu vào clipboard",
        variant: "info",
    });
};

const goToLogin = () => {
    router.push("/login");
};
</script>

<template>
    <div
        class="min-h-screen bg-green-300 flex items-center justify-center p-4 py-10 relative"
        style="
            background-image: radial-gradient(black 1px, transparent 1px);
            background-size: 20px 20px;
        "
    >
        <div
            class="absolute top-10 left-10 md:w-32 md:h-32 bg-yellow-400 border-4 border-black rounded-full shadow-neo hidden md:block"
        ></div>
        <div
            class="absolute bottom-10 right-10 md:w-40 md:h-40 bg-blue-400 border-4 border-black shadow-neo hidden md:block"
        ></div>

        <div
            v-if="showSuccessModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
            <div
                class="bg-white border-4 border-black shadow-neo p-8 max-w-md w-full text-center relative animate-bounce-in"
            >
                <div class="flex justify-center mb-4 text-green-500">
                    <CheckCircle :size="64" stroke-width="3" />
                </div>

                <h2 class="text-3xl font-display font-black uppercase mb-2">Đăng Ký Thành Công!</h2>
                <p class="font-body text-gray-600 mb-6">
                    Tài khoản của bạn đã được tạo. Vui lòng ghi nhớ mã số bên dưới để đăng nhập.
                </p>

                <div
                    class="bg-yellow-100 border-2 border-black border-dashed p-4 mb-6 flex flex-col items-center gap-2"
                >
                    <span class="font-bold text-sm uppercase text-gray-500 font-display"
                        >Mã Độc Giả Của Bạn</span
                    >
                    <div class="flex items-center gap-3">
                        <span class="text-4xl font-black font-mono tracking-wider">{{
                            createdReaderId
                        }}</span>
                        <button
                            @click="copyId"
                            class="p-2 hover:bg-yellow-200 rounded border-2 border-transparent hover:border-black transition-all"
                            title="Sao chép"
                        >
                            <Copy :size="20" />
                        </button>
                    </div>
                </div>

                <NeoButton
                    @click="goToLogin"
                    variant="primary"
                    class="w-full flex justify-center items-center gap-2"
                >
                    ĐẾN TRANG ĐĂNG NHẬP <ArrowRight :size="20" />
                </NeoButton>
            </div>
        </div>

        <div
            class="w-full max-w-3xl bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative z-10"
            :class="{ 'blur-sm pointer-events-none': showSuccessModal }"
        >
            <div class="bg-black text-white p-6 flex items-center justify-between">
                <h1
                    class="text-3xl font-black uppercase tracking-wider text-yellow-400 font-display"
                >
                    Đăng ký Thẻ
                </h1>
                <RouterLink
                    to="/login"
                    class="bg-white text-black px-4 py-2 font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 border-2 border-transparent hover:border-white"
                >
                    <ArrowLeft :size="20" /> Quay lại
                </RouterLink>
            </div>

            <div class="p-8">
                <form
                    @submit.prevent="handleRegister"
                    class="grid grid-cols-1 md:grid-cols-12 gap-6"
                >
                    <div class="md:col-span-8 bg-blue-50 border-2 border-black p-5 shadow-neo-sm">
                        <h3
                            class="font-black text-lg mb-4 uppercase flex items-center gap-2 font-display"
                        >
                            <span
                                class="bg-blue-500 text-white w-8 h-8 flex items-center justify-center border-2 border-black"
                                >1</span
                            >
                            Thông tin cá nhân
                        </h3>

                        <div class="grid grid-cols-2 gap-4">
                            <NeoInput
                                id="hoLot"
                                label="Họ & tên đệm"
                                v-model="form.hoLot"
                                placeholder="Nguyễn"
                            />
                            <NeoInput id="ten" label="Tên" v-model="form.ten" placeholder="Văn A" />
                        </div>

                        <div class="grid grid-cols-2 gap-4 mt-4">
                            <NeoInput
                                id="dob"
                                label="Ngày sinh"
                                type="date"
                                v-model="form.ngaySinh"
                            />

                            <NeoSelect
                                id="gender"
                                label="Giới tính"
                                v-model="form.gioiTinh"
                                :options="genderOptions"
                            />
                        </div>
                    </div>

                    <div
                        class="md:col-span-4 bg-pink-50 border-2 border-black p-5 shadow-neo-sm flex flex-col"
                    >
                        <h3
                            class="font-black text-lg mb-4 uppercase flex items-center gap-2 font-display"
                        >
                            <span
                                class="bg-pink-500 text-white w-8 h-8 flex items-center justify-center border-2 border-black"
                                >2</span
                            >
                            Bảo mật
                        </h3>
                        <NeoInput
                            id="pass"
                            label="Mật khẩu"
                            type="password"
                            v-model="form.matKhau"
                            placeholder="Tối thiểu 8 ký tự"
                        />

                        <div
                            class="mt-4 text-xs font-bold text-gray-500 bg-white p-2 border-2 border-black border-dashed font-body"
                        >
                            * Mật khẩu dùng để đăng nhập.
                        </div>
                    </div>

                    <div
                        class="md:col-span-12 bg-yellow-50 border-2 border-black p-5 shadow-neo-sm"
                    >
                        <h3
                            class="font-black text-lg mb-4 uppercase flex items-center gap-2 font-display"
                        >
                            <span
                                class="bg-yellow-500 w-8 h-8 flex items-center justify-center border-2 border-black text-black"
                                >3</span
                            >
                            Liên hệ
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <NeoInput
                                id="phone"
                                label="Số điện thoại"
                                v-model="form.soDienThoai"
                                placeholder="0909..."
                            />
                            <NeoInput
                                id="address"
                                label="Địa chỉ cư trú"
                                v-model="form.diaChi"
                                placeholder="Số nhà, tên đường..."
                            />
                        </div>
                    </div>

                    <div
                        v-if="error"
                        class="md:col-span-12 bg-red-100 border-2 border-red-500 text-red-600 p-3 font-bold text-sm font-body"
                    >
                        {{ (error as any).message || "Đăng ký thất bại" }}
                    </div>

                    <div class="md:col-span-12 mt-4">
                        <NeoButton
                            variant="primary"
                            class="w-full text-xl py-4 flex justify-center items-center gap-3 hover:bg-green-400 font-display"
                            :disabled="isPending"
                        >
                            <CheckCircle :size="28" />
                            {{ isPending ? "ĐANG XỬ LÝ..." : "HOÀN TẤT ĐĂNG KÝ" }}
                        </NeoButton>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes bounce-in {
    0% {
        transform: scale(0.9);
        opacity: 0;
    }
    50% {
        transform: scale(1.05);
        opacity: 1;
    }
    100% {
        transform: scale(1);
    }
}
.animate-bounce-in {
    animation: bounce-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>
