<script setup lang="ts">
import { ref } from "vue";
import NeoInput from "@/components/ui/NeoInput.vue";
import NeoButton from "@/components/ui/NeoButton.vue";
import { ArrowLeft, CheckCircle } from "lucide-vue-next";

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
    console.log("Dữ liệu đăng ký:", form.value);
    // TODO: Gọi API registerDocGia
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
            class="w-full max-w-3xl bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative z-10"
        >
            <div class="bg-black text-white p-6 flex items-center justify-between">
                <h1 class="text-3xl font-black uppercase tracking-wider text-yellow-400">
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
                        <h3 class="font-black text-lg mb-4 uppercase flex items-center gap-2">
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
                            <div class="flex flex-col gap-1">
                                <label class="font-bold text-sm ml-1">Giới tính</label>
                                <select
                                    v-model="form.gioiTinh"
                                    class="w-full p-3 border-2 border-black outline-none bg-white focus:shadow-neo-sm h-[52px]"
                                >
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div
                        class="md:col-span-4 bg-pink-50 border-2 border-black p-5 shadow-neo-sm flex flex-col"
                    >
                        <h3 class="font-black text-lg mb-4 uppercase flex items-center gap-2">
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
                            class="mt-4 text-xs font-bold text-gray-500 bg-white p-2 border-2 border-black border-dashed"
                        >
                            * Mật khẩu dùng để đăng nhập vào hệ thống mượn trả sách.
                        </div>
                    </div>

                    <div
                        class="md:col-span-12 bg-yellow-50 border-2 border-black p-5 shadow-neo-sm"
                    >
                        <h3 class="font-black text-lg mb-4 uppercase flex items-center gap-2">
                            <span
                                class="bg-yellow-500 text-white w-8 h-8 flex items-center justify-center border-2 border-black text-black"
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
                                placeholder="Số nhà, tên đường, phường/xã..."
                            />
                        </div>
                    </div>

                    <div class="md:col-span-12 mt-4">
                        <NeoButton
                            variant="primary"
                            class="w-full text-xl py-4 flex justify-center items-center gap-3 hover:bg-green-400"
                        >
                            <CheckCircle :size="28" /> HOÀN TẤT ĐĂNG KÝ
                        </NeoButton>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
