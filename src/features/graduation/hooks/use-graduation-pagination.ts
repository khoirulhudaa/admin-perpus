// import { useQuery } from "@tanstack/react-query";

// export const useGraduationPagination = ({
//     page,
//     size,
//     sekolahId,
//     idKelas,
//     keyword,
//   }: {
//     page: number;
//     size: number;
//     sekolahId?: number;
//     idKelas?: number;
//     keyword?: string;
//   }) => {
//     return useQuery({
//       queryKey: ["students", page, size, sekolahId, idKelas, keyword],
//       queryFn: async () => {
//         const params = new URLSearchParams();
//         params.append("page", page.toString());
//         params.append("size", size.toString());

//         if (sekolahId) params.append("sekolahId", sekolahId.toString());

//         if (idKelas !== undefined) {
//           params.append("idKelas", idKelas.toString());
//         }
//         if (keyword) {
//           params.append("search", keyword);
//         }
  
//         const token = localStorage.getItem("token");
//         const response = await fetch(
//           `https://dev.kiraproject.id/api/user-siswa?${params.toString()}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
  
//         const result = await response.json();
//         return {
//           students: result.data,
//           pagination: result.pagination,
//         };
//       },
//       keepPreviousData: true,
//       enabled: !!page && !!size, // ✅ optional: jaga-jaga page/size belum siap
//     });
//   };
  
import { StudentPaginationResponse } from "@/core/models/pagination";
import { GetPaginatedStudentParams, studentService } from "@/core/services/pagination";
import { useQuery } from "@tanstack/react-query";


export const useGraduationPagination = (params: GetPaginatedStudentParams) => {
  return useQuery<StudentPaginationResponse, Error>({

    queryKey: ["graduations", params],
    queryFn: () => studentService.getPaginated( params ),
    keepPreviousData: true,
    enabled: !!params.page && !!params.size && params.keyword !== undefined

  });
};
