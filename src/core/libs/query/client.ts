import { QUERY_CONFIG } from "@/core/configs";
import { QueryClient } from "@tanstack/react-query";

export const vokadashQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: QUERY_CONFIG.retry,
      gcTime: QUERY_CONFIG.gcTime,
    },
    mutations: {
      retry: QUERY_CONFIG.retry,
    },
  },
});
