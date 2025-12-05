import { useQuery } from "@tanstack/vue-query";
import { booksApi } from "./api";
import { computed } from "vue";

export function useBooks() {
    return useQuery({
        queryKey: ["books"],
        queryFn: booksApi.getAll,
        staleTime: 1000 * 60 * 5,
    });
}

export function useBook(id: any) {
    return useQuery({
        enabled: computed(() => !!id.value),
        queryKey: ["book", id],
        queryFn: () => booksApi.getById(id.value),
    });
}

export function useBorrowHistory() {
    return useQuery({
        queryKey: ["borrow-history"],
        queryFn: booksApi.getHistory,
    });
}
