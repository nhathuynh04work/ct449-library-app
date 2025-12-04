import { useQuery } from "@tanstack/vue-query";
import { booksApi } from "./api";

export function useBooks() {
    return useQuery({
        queryKey: ["books"],
        queryFn: booksApi.getAll,
        staleTime: 1000 * 60 * 5,
    });
}
