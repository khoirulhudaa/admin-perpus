// import { SchoolCreationModel } from "@/core/models/schools";
// import { schoolService } from "@/core/services";
// import { useAuth } from "@/features/auth";
// import { useProfile } from "@/features/profile";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { useMemo } from "react";

// export const useSchool = () => {
//   const auth = useAuth();
//   const profile = useProfile();
//   const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

//   const schoolId = profile.user?.sekolah?.id;

//   const query = useQuery({
//     enabled,
//     queryKey: ["schools"],
//     queryFn: () => schoolService.all(),
//     staleTime: 1 * 60 * 1000, // Data fresh selama 5 menit
//     // gcTime: 10 * 60 * 1000, // Data disimpan di cache selama 10 menit
//     refetchOnWindowFocus: false, // Nonaktifkan
//   });

//   const mutation = useMutation({
//     mutationFn: (vars: SchoolCreationModel) => schoolService.create(vars),
//     onSuccess: () => {
//       query.refetch();
//     },
//   });

//   const create = (form: SchoolCreationModel) => mutation.mutateAsync(form);

//   const data = useMemo(() => {
//     if (!schoolId) return query.data?.data || [];
//     return (
//       query.data?.data?.filter((d) => Number(d.id) === Number(schoolId)) || []
//     );
//   }, [query.data?.data, schoolId]);
//   const isLoading = query.isLoading || query.isFetching || query.isPending;

//   return {
//     query,
//     data,
//     isLoading,
//     create,
//   };
// };

// export const useSchoolForCard = () => {
//   const auth = useAuth();
//   const profile = useProfile();
//   const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

//   const schoolId = profile.user?.sekolah?.id;

//   const query = useQuery({
//     enabled,
//     queryKey: ["schools"],
//     queryFn: () => schoolService.all(),
//     staleTime: 5 * 60 * 1000, // Data fresh selama 5 menit
//     gcTime: 10 * 60 * 1000, // Cache 10 menit
//     refetchOnWindowFocus: false, // Jangan refetch saat pindah tab
//     refetchInterval: false, // ✅ Hindari auto refetch
//   });

//   const data = useMemo(() => {
//     if (!schoolId) return query.data?.data || [];
//     return (
//       query.data?.data?.filter((d) => Number(d.id) === Number(schoolId)) || []
//     );
//   }, [query.data?.data, schoolId]);

//   const isLoading = query.isLoading; // ✅ Hanya loading awal

//   return {
//     data,
//     isLoading,
//     refetch: query.refetch,
//   };
// };



// hooks/useSchool.ts
// import { useProfile } from "./useProfile";
import { useProfile } from "@/features/profile";
import { useMemo } from "react";

export const useSchool = () => {
  // Ambil data dari useProfile yang sudah kita buat sebelumnya
  const { user, query, isLoading: profileLoading } = useProfile();

  console.log(user)

  // Kita bungkus data sekolah dari profil ke dalam array []
  // Karena HomePage lama mengharapkan output berupa array: const school = schools?.[0];
  const data = useMemo(() => {
    if (!user || !user.sekolah) return [];
    
    // Sesuaikan mapping agar nama field dari backend localhost pas dengan UI
    return [{
      id: user.sekolah.id,
      namaSekolah: user.sekolah.namaSekolah,
      npsn: user.sekolah.npsn,
      adminName: user.name,
      email: user.email,
      address: user.sekolah.address,
      nameProvince: user.sekolah.nameProvince || "DKI Jakarta", // dummy jika null
      file: user.sekolah.file // Logo URL
    }];
  }, [user]);

  return {
    data,
    isLoading: profileLoading,
    error: query.error,
    refetch: query.refetch
  };
};

// Versi Card (biasanya digunakan di sidebar atau list)
export const useSchoolForCard = () => {
  return useSchool(); // Re-use logika yang sama
};