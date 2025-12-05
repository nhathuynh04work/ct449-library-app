<script setup lang="ts">
import { ref, computed } from "vue";
import { Search, Plus, Loader2 } from "lucide-vue-next";
import NeoButton from "@/components/ui/NeoButton.vue";
import NeoInput from "@/components/ui/NeoInput.vue";
import NeoSelect from "@/components/ui/NeoSelect.vue";
import BaseModal from "@/components/common/BaseModal.vue";
import { useReaders } from "@/features/management/queries";
import { useCreateReader } from "@/features/management/mutations";
import { useToast } from "@/composables/useToast";

const { data: readers, isLoading } = useReaders();
const { mutate: createReader, isPending } = useCreateReader();
const { addToast } = useToast();

const searchQuery = ref("");
const showModal = ref(false);

const form = ref({
    hoLot: "",
    ten: "",
    ngaySinh: "",
    gioiTinh: "Nam",
    diaChi: "",
    soDienThoai: "",
    matKhau: "",
});

const genderOptions = [
    { value: "Nam", label: "Nam" },
    { value: "Nữ", label: "Nữ" },
    { value: "Khác", label: "Khác" },
];

const filteredReaders = computed(() => {
    if (!readers.value) return [];
    return readers.value.filter(
        (r) =>
            r.ten.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            r.maDocGia.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
});

const handleCreate = () => {
    createReader(form.value, {
        onSuccess: () => {
            addToast({
                title: "Thành công",
                description: "Đã tạo tài khoản độc giả.",
                variant: "success",
            });
            showModal.value = false;
            form.value = {
                hoLot: "",
                ten: "",
                ngaySinh: "",
                gioiTinh: "Nam",
                diaChi: "",
                soDienThoai: "",
                matKhau: "",
            };
        },
        onError: (err) => {
            addToast({ title: "Lỗi", description: err.message, variant: "error" });
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
                    placeholder="Tìm độc giả..."
                    class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-black font-bold outline-none focus:shadow-neo-sm transition-all"
                />
            </div>
            <NeoButton @click="showModal = true" class="flex items-center gap-2">
                <Plus :size="20" /> Thêm Độc Giả
            </NeoButton>
        </div>

        <div class="bg-white border-4 border-black shadow-neo overflow-hidden min-h-[400px]">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-green-300 border-b-4 border-black text-black">
                        <th class="p-4 border-r-2 border-black font-black uppercase">Mã ĐG</th>
                        <th class="p-4 border-r-2 border-black font-black uppercase">Họ Tên</th>
                        <th class="p-4 border-r-2 border-black font-black uppercase">Thông Tin</th>
                        <th class="p-4 font-black uppercase">Ngày ĐK</th>
                    </tr>
                </thead>
                <tbody class="divide-y-2 divide-black">
                    <tr v-if="isLoading">
                        <td colspan="4" class="p-8 text-center font-bold">Đang tải dữ liệu...</td>
                    </tr>
                    <tr
                        v-for="reader in filteredReaders"
                        :key="reader._id"
                        class="hover:bg-green-50 transition-colors"
                    >
                        <td class="p-4 border-r-2 border-black font-mono font-bold">
                            {{ reader.maDocGia }}
                        </td>
                        <td class="p-4 border-r-2 border-black font-bold">
                            {{ reader.hoLot }} {{ reader.ten }}
                        </td>
                        <td class="p-4 border-r-2 border-black text-sm">
                            <p>SĐT: {{ reader.soDienThoai }}</p>
                            <p class="truncate max-w-[250px]" :title="reader.diaChi">
                                {{ reader.diaChi }}
                            </p>
                        </td>
                        <td class="p-4 font-mono text-sm">
                            {{ reader.createdAt ? formatDate(reader.createdAt.toString()) : "-" }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <BaseModal
            :isOpen="showModal"
            title="Thêm Độc Giả Mới"
            headerClass="bg-yellow-300"
            @close="showModal = false"
        >
            <div class="space-y-4">
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
                <NeoInput id="phone" label="Số điện thoại" v-model="form.soDienThoai" />
                <NeoInput id="address" label="Địa chỉ" v-model="form.diaChi" />
                <NeoInput id="pass" label="Mật khẩu" type="password" v-model="form.matKhau" />

                <div class="flex justify-end gap-3 pt-4 border-t-2 border-black">
                    <NeoButton type="button" variant="secondary" @click="showModal = false">
                        Hủy
                    </NeoButton>
                    <NeoButton @click="handleCreate" :disabled="isPending">
                        <Loader2 v-if="isPending" class="animate-spin" />
                        <span v-else>Tạo Tài Khoản</span>
                    </NeoButton>
                </div>
            </div>
        </BaseModal>
    </div>
</template>
