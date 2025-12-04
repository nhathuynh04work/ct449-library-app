import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { booksApi } from "./api";

export function useDeleteBook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (maSach: string) => booksApi.delete(maSach),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
    });
}
