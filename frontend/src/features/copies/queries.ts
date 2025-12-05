import { useQuery } from "@tanstack/vue-query";
import { copiesApi } from "./api";
import { computed } from "vue";

export function useBookCopies(sachId: any) {
    return useQuery({
        enabled: computed(() => !!sachId.value),
        queryKey: ["copies", sachId],
        queryFn: () => copiesApi.getByBookId(sachId.value),
    });
}
