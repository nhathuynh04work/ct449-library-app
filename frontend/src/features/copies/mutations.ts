import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { copiesApi } from "./api";

export function useCreateCopy() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (sachId: string) => copiesApi.create(sachId),
        onSuccess: (_, sachId) => {
            queryClient.invalidateQueries({ queryKey: ["copies", sachId] });
            queryClient.invalidateQueries({ queryKey: ["books"] }); // Refresh book count in main table
        },
    });
}

export function useUpdateCopyStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            copiesApi.updateStatus(id, status),
        onSuccess: (data) => {
            // We need the book ID to invalidate the specific list,
            // but the API returns the populated book object usually.
            // If strictly needed we can invalidate all copies or be more specific.
            queryClient.invalidateQueries({ queryKey: ["copies"] });
        },
    });
}

export function useDeleteCopy() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => copiesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["copies"] });
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
    });
}
