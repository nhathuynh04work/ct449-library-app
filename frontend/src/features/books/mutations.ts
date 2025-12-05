import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { booksApi, type CreateBookPayload } from "./api";

export function useDeleteBook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (maSach: string) => booksApi.delete(maSach),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
    });
}

export function useCreateBook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateBookPayload) => booksApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
    });
}

export function useBorrowBook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => booksApi.borrow(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
    });
}

export function useCancelBorrow() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => booksApi.cancelRequest(id),
        onSuccess: () => {
            // Invalidate history to show new status
            queryClient.invalidateQueries({ queryKey: ["borrow-history"] });
            // Invalidate books to update availability counts
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
    });
}
