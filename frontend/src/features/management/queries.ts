import { useQuery } from "@tanstack/vue-query";
import { managementApi } from "./api";

export function useStaff() {
    return useQuery({
        queryKey: ["staff"],
        queryFn: managementApi.getAllStaff,
    });
}

export function useReaders() {
    return useQuery({
        queryKey: ["readers"],
        queryFn: managementApi.getAllReaders,
    });
}
