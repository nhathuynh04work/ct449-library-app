<script setup lang="ts">
import { ref, computed } from "vue";
import { Search, Plus, Shield, ShieldAlert, Loader2 } from "lucide-vue-next";
import NeoButton from "@/components/ui/NeoButton.vue";
import NeoInput from "@/components/ui/NeoInput.vue";
import NeoSelect from "@/components/ui/NeoSelect.vue";
import { useStaff } from "@/features/management/queries";
import { useCreateStaff } from "@/features/management/mutations";
import { useToast } from "@/composables/useToast";

const { data: staffList, isLoading } = useStaff();
const { mutate: createStaff, isPending } = useCreateStaff();
const { addToast } = useToast();

const searchQuery = ref("");
const showModal = ref(false);

// Form
const form = ref({
    hoLot: "",
    ten: "",
    ngaySinh: "",
    gioiTinh: "Nam",
    chucVu: "LIBRARIAN",
    diaChi: "",
    soDienThoai: "",
    matKhau: "",
});

const genderOptions = [
    { value: "Nam", label: "Nam" },
    { value: "Nữ", label: "Nữ" },
    { value: "Khác", label: "Khác" },
];

const roleOptions = [
    { value: "LIBRARIAN", label: "Thủ thư" },
    { value: "ADMIN", label: "Quản trị viên" },
];

const filteredStaff = computed(() => {
    if (!staffList.value) return [];
    return staffList.value.filter(
        (s) =>
            s.ten.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            s.maNhanVien.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
});

const handleCreate = () => {
    createStaff(form.value, {
        onSuccess: () => {
            addToast({
                title: "Thành công",
                description: "Đã tạo tài khoản nhân viên.",
                variant: "success",
            });
            showModal.value = false;
            // Reset form
            form.value = {
                hoLot: "",
                ten: "",
                ngaySinh: "",
                gioiTinh: "Nam",
                chucVu: "LIBRARIAN",
                diaChi: "",
                soDienThoai: "",
                matKhau: "",
            };
        },
        onError: (err) => {
            addToast({
                title: "Lỗi",
                description: err.message || "Không thể tạo nhân viên.",
                variant: "error",
            });
        },
    });
};

const formatDate = (date: string) => new Date(date).toLocaleDateString("vi-VN");
</script>

<template>
    <div class="space-y-6">
        <div
            class="flex justify-between items-center bg-white p-4 border-4 border-black shadow-neo"
        >
            <div class="relative w-96">
                <Search class="absolute left-3 top-3 text-gray-500" :size="20" />
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Tìm theo tên, mã NV..."
                    class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-black font-bold outline-none focus:shadow-neo-sm transition-all"
                />
            </div>
            <NeoButton @click="showModal = true" class="flex items-center gap-2">
                <Plus :size="20" /> Thêm Nhân Viên
            </NeoButton>
        </div>

        <div class="bg-white border-4 border-black shadow-neo overflow-hidden min-h-[400px]">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-blue-300 border-b-4 border-black text-black">
                        <th class="p-4 border-r-2 border-black font-black uppercase">Mã NV</th>
                        <th class="p-4 border-r-2 border-black font-black uppercase">Họ Tên</th>
                        <th class="p-4 border-r-2 border-black font-black uppercase">Chức Vụ</th>
                        <th class="p-4 border-r-2 border-black font-black uppercase">Liên Hệ</th>
                        <th class="p-4 font-black uppercase">Ngày Vào</th>
                    </tr>
                </thead>
                <tbody class="divide-y-2 divide-black">
                    <tr v-if="isLoading">
                        <td colspan="5" class="p-8 text-center font-bold">Đang tải dữ liệu...</td>
                    </tr>
                    <tr
                        v-for="staff in filteredStaff"
                        :key="staff._id"
                        class="hover:bg-blue-50 transition-colors"
                    >
                        <td class="p-4 border-r-2 border-black font-mono font-bold">
                            {{ staff.maNhanVien }}
                        </td>
                        <td class="p-4 border-r-2 border-black font-bold">
                            {{ staff.hoLot }} {{ staff.ten }}
                        </td>
                        <td class="p-4 border-r-2 border-black">
                            <span
                                class="inline-flex items-center gap-1 px-2 py-1 border-2 border-black text-xs font-bold bg-white shadow-neo-sm"
                                :class="staff.chucVu === 'ADMIN' ? 'text-red-600' : 'text-blue-600'"
                            >
                                <component
                                    :is="staff.chucVu === 'ADMIN' ? ShieldAlert : Shield"
                                    :size="14"
                                />
                                {{ staff.chucVu }}
                            </span>
                        </td>
                        <td class="p-4 border-r-2 border-black text-sm">
                            <p>SĐT: {{ staff.soDienThoai }}</p>
                            <p class="truncate max-w-[200px]" :title="staff.diaChi">
                                {{ staff.diaChi }}
                            </p>
                        </td>
                        <td class="p-4 font-mono text-sm">
                            {{ staff.createdAt ? formatDate(staff.createdAt.toString()) : "-" }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div
            v-if="showModal"
            class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            @click.self="showModal = false"
        >
            <div class="bg-white border-4 border-black shadow-neo w-full max-w-2xl animate-in">
                <div class="bg-yellow-300 p-4 border-b-4 border-black font-black uppercase text-xl">
                    Thêm Nhân Viên Mới
                </div>
                <div class="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div class="grid grid-cols-2 gap-4">
                        <NeoInput id="ho" label="Họ Lót" v-model="form.hoLot" />
                        <NeoInput id="ten" label="Tên" v-model="form.ten" />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <NeoInput id="dob" label="Ngày sinh" type="date" v-model="form.ngaySinh" />
                        <NeoSelect
                            id="gender"
                            label="Giới tính"
                            :options="genderOptions"
                            v-model="form.gioiTinh"
                        />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <NeoInput id="phone" label="Số điện thoại" v-model="form.soDienThoai" />
                        <NeoSelect
                            id="role"
                            label="Chức vụ"
                            :options="roleOptions"
                            v-model="form.chucVu"
                        />
                    </div>
                    <NeoInput id="address" label="Địa chỉ" v-model="form.diaChi" />
                    <NeoInput id="pass" label="Mật khẩu" type="password" v-model="form.matKhau" />

                    <div class="flex justify-end gap-3 pt-4">
                        <button
                            @click="showModal = false"
                            class="px-4 py-2 font-bold hover:underline"
                        >
                            Hủy
                        </button>
                        <NeoButton @click="handleCreate" :disabled="isPending">
                            <Loader2 v-if="isPending" class="animate-spin" />
                            <span v-else>Tạo Tài Khoản</span>
                        </NeoButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-in {
    animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes popIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
