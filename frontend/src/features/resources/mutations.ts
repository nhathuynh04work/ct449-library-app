import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { resourcesApi } from "./api";

// Authors
export function useCreateAuthor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: resourcesApi.createAuthor,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authors"] }),
    });
}
export function useDeleteAuthor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: resourcesApi.deleteAuthor,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authors"] }),
    });
}

// Publishers
export function useCreatePublisher() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: resourcesApi.createPublisher,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["publishers"] }),
    });
}
export function useDeletePublisher() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: resourcesApi.deletePublisher,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["publishers"] }),
    });
}

// Categories
export function useCreateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: resourcesApi.createCategory,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
    });
}
export function useDeleteCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: resourcesApi.deleteCategory,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
    });
}
