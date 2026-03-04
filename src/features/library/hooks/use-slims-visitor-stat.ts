import { slimsService } from "@/core/services/slims";
import { useQuery } from "@tanstack/react-query";


export const useSlimsVisitorStats = (
  baseUrl?: string,
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ["slims-visitor-stats", baseUrl, startDate, endDate],
    enabled: !!baseUrl && !!startDate && !!endDate,
    queryFn: () => slimsService.getVisitorStats(baseUrl!, startDate!, endDate!),
    staleTime: 1000 * 60 * 2, // 5 minutes
  });
};