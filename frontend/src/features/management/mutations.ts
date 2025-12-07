import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { managementApi } from "./api";

export function useCreateStaff() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: managementApi.createStaff,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff"] });
        },
    });
}

export function useCreateReader() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: managementApi.createReader,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["readers"] });
        },
    });
}

export function useToggleBlockReader() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: managementApi.toggleBlockReader,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["readers"] });
        },
    });
}
