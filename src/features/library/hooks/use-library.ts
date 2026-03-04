import { libraryService } from "@/core/services";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";

interface UseLibraryProps {
  sekolahId?: number;
  tanggal?: string;
  tahun?: string; // Added tahun parameter
}

export const useLibrary = (props?: UseLibraryProps) => {
  const auth = useAuth();
  const profile = useProfile();
  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    enabled,
    queryKey: ["libraries", props?.sekolahId, props?.tanggal, props?.tahun], // Added tahun to queryKey
    queryFn: async () => {
      // Build query parameters
      const params = new URLSearchParams();
      if (props?.tanggal) {
        params.append("tanggal", props.tanggal);
      }
      if (props?.tahun) {
        params.append("tahun", props.tahun);
      }
      if (props?.sekolahId) {
        params.append("sekolahId", props.sekolahId.toString());
      }

      const url = `https://dev.kiraproject.id/api/get-history-perpus${params.toString() ? `?${params.toString()}` : ''}`;
      console.log("useLibrary request URL:", url);
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          "Content-Type": "application/json",
        },
      });
      return { data: response.data }; // Wrap response in { data: ... }
    },
  });

  const mutation = useMutation({
    mutationFn: (vars: any) => libraryService.createAbsenManual(vars),
    onSuccess: () => {
      query.refetch();
    },
  });

  const create = (form: any) => mutation.mutateAsync(form);

  const data = useMemo(() => {
    return query.data?.data;
  }, [query.data, props?.sekolahId, props?.tanggal, props?.tahun, enabled]); // Added tahun to dependencies

  const isLoading = query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    data,
    isLoading,
    create,
  };
};