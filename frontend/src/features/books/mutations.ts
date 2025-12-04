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
