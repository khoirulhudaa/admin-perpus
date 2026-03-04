// import { userService } from "@/core/services/user";
// import { useAuth } from "@/features/auth/hooks";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { useEffect, useRef } from "react";

// interface MutationVars {
//   type: "change-password" | "update-profile" | "update-photo";
//   data?: unknown;
// }

// export const useProfile = () => {
//   const auth = useAuth();
//   const authRef = useRef(auth);
//   authRef.current = auth;

//   const query = useQuery({
//     queryKey: ["profile"],
//     queryFn: () => userService.getProfile(),
//     enabled: auth.isAuthenticated(),
//     staleTime: 5 * 60 * 1000, // 5 menit
//     refetchOnWindowFocus: false, 
//   });

//   const mutation = useMutation({
//     mutationFn: (vars: MutationVars) => {
//       switch (vars.type) {
//         case "change-password":
//           return userService.changePassword(vars.data);
//         case "update-profile":
//           return userService.updateProfile(vars.data);
//         case "update-photo":
//           return userService.updatePhoto(vars.data, {
//             contentType: "form-data",
//           });
//         default:
//           throw new Error("invalid mutation type");
//       }
//     },
//   });

//   useEffect(() => {
//     if (
//       query.isError &&
//       query.error?.message?.toLowerCase?.()?.includes?.("unauthorized")
//     ) {
//       authRef.current?.logout();
//     }
//   }, [query.isError, query.error?.message]);

//   const data = query.data?.data;

//   const updateProfile = (data: unknown) =>
//     mutation.mutateAsync({ type: "update-profile", data });
//   const changePassword = (data: unknown) =>
//     mutation.mutateAsync({ type: "change-password", data });

//   const updatePhoto = (data: unknown) => {
//     const formData = new FormData();
//     if (data) formData.append("file", data as Blob);
//     return mutation.mutateAsync({ type: "update-photo", data: formData });
//   };

//   return {
//     query,
//     mutation,
//     updateProfile,
//     changePassword,
//     updatePhoto,
//     ...data,
//   };
// };



import { useAuth } from "@/features/auth/hooks/useAuth";
// import { useAuth } from "@/features/auth/hooks";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// hooks/useProfile.ts
export const useProfile = () => {
  const auth = useAuth();
  
  const query = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      // const res = await axios.get("http://localhost:5005/auth/profile", {
      const res = await axios.get("https://be-school.kiraproject.id/auth/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      return res.data.data; // Mengambil object { id, name, sekolah, ... }
    },
    enabled: auth.isAuthenticated()
  });

  const profileData = query.data;

  return {
    query,
    user: profileData, // Ini yang dipakai di HomePage (profile?.user?.name)
    sekolah: profileData?.sekolah,
    isLoading: query.isLoading
  };
};