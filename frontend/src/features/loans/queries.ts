import { useQuery } from "@tanstack/vue-query";
import { loansApi } from "./api";

export function useLoans() {
    return useQuery({
        queryKey: ["loans"],
        queryFn: loansApi.getAll,
        staleTime: 0, // Always fetch fresh data for admin
    });
}
