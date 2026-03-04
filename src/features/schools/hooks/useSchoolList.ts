import { useQuery } from "@tanstack/react-query";
import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "@/core/configs/app";
import { getInitialOptions } from "@/core/utils";

export const useSchoolList = ({ enabled }: { enabled: boolean }) => {
  const query = useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      const response = await http.get(
        `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.school.schools}`,
        getInitialOptions()
      )();
      
      console.log("✅ School List Response:", response);
      return response.data?.data ?? []; 
    },
    enabled,
  });

  console.log("📊 School List Data:", query.data);
  return {
    ...query,
  data: query.data?.data ?? [],
  };
};
