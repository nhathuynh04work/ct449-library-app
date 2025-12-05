import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { loansApi } from "./api";

export function useUpdateLoanStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            loansApi.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["loans"] });
        },
    });
}
