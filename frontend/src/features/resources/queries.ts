import { useQuery } from "@tanstack/vue-query";
import { resourcesApi } from "./api";

export function useAuthors() {
    return useQuery({ queryKey: ["authors"], queryFn: resourcesApi.getAuthors });
}

export function usePublishers() {
    return useQuery({ queryKey: ["publishers"], queryFn: resourcesApi.getPublishers });
}

export function useCategories() {
    return useQuery({ queryKey: ["categories"], queryFn: resourcesApi.getCategories });
}
