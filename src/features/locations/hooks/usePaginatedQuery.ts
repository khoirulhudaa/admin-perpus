import { useQuery } from "@tanstack/react-query";
import { http } from "@itokun99/http";
import { API_CONFIG } from "@/core/configs/app";
import { getInitialOptions } from "@/core/utils";


interface UsePaginatedQueryProps<T> {
  queryKey: string;
  endpoint: string;
  params?: Record<string, any>;
  page: number;
  size: number;
}

export const usePaginatedQuery = <T>({
  queryKey,
  endpoint,
  params = {},
  page,
  size,
}: UsePaginatedQueryProps<T>) => {
  const query = useQuery({
    queryKey: [queryKey, { ...params, page, size }],
    queryFn: async () => {
      console.log("🔍 Query Params:", { ...params, page, size });

      const response = await http.get(`${API_CONFIG.baseUrl}${endpoint}`, getInitialOptions())({
        params: { ...params, page, size },
      });

      return response;
    },
    keepPreviousData: true,
  });

  console.log("📊 Query Data:", query.data?.data);
  console.log("📊 Query Pagination:", query.data?.pagination);

  return {
    data: query.data?.data || [],
    pagination: query.data?.pagination || { currentPage: 1, totalPages: 1 },
    isLoading: query.isLoading,
    error: query.error,
  };
};


