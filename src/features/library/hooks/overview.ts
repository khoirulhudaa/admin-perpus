import { useQuery } from "@tanstack/react-query";
import { fetchLibraryMembers } from "../utils";

export const useLibraryMembers = ({
  server,
  sekolahId
}: {
  server?: string;
  sekolahId?: number;
}) => {
  return useQuery<number>({
    queryKey: ["library-members", server, sekolahId],
    queryFn: () => fetchLibraryMembers({ server, sekolahId }),
    enabled: !!server && !!sekolahId,
    staleTime: 1000 * 60 * 2, // fresh 10 menit
    gcTime: 1000 * 60 * 5 // cache 5 menit
  });
};
