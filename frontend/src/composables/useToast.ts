import { ref } from "vue";

export interface Toast {
    id: string;
    title: string;
    description?: string;
    variant?: "success" | "error" | "warning" | "info";
    duration?: number;
}

const toasts = ref<Toast[]>([]);

export function useToast() {
    const addToast = (toast: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { ...toast, id };
        toasts.value.push(newToast);

        if (toast.duration !== 0) {
            setTimeout(() => {
                removeToast(id);
            }, toast.duration || 5000);
        }
    };

    const removeToast = (id: string) => {
        toasts.value = toasts.value.filter((t) => t.id !== id);
    };

    return {
        toasts,
        addToast,
        removeToast,
    };
}
