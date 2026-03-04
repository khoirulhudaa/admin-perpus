import { slimsService } from "@/core/services/slims";
import { useQuery } from "@tanstack/react-query";


export const useTodayVisitors = (baseUrl: string | null) => {
  return useQuery({
    queryKey: ["todayVisitors", baseUrl],
    queryFn: () => slimsService.getTodayVisitors(baseUrl!),
    enabled: !!baseUrl,
    staleTime: 1000 * 60 * 2,
  });
};