// import {
//   Card,
//   CardDescription,
//   CardHeader,
//   CardTitle,
//   lang
// } from "@/core/libs";
// import { useBiodata } from "@/features/user/hooks";
// import { useClassroomDetail } from "../hooks";
// import { useMemo } from "react";

// export interface ClassroomInformationProps {
//   id?: number;
// }

// export const ClassroomInformation = (props: ClassroomInformationProps) => {
//   const detail = useClassroomDetail({ id: Number(props.id) });
//   const student = useBiodata();

//   const students = useMemo(() => {
//       let parsedData = [];
  
//       try {
//         parsedData = typeof student.data === "string" ? JSON.parse(student.data) : student.data;
//       } catch (error) {
//         console.error("Gagal parse student.data", error);
//       }
  
//       return parsedData?.filter((d) => {
//         const studentSchoolId = Number(d?.user?.sekolah?.id);
//         const studentClassroomId = Number(d?.kelas?.id);
//         const isActive = d?.user?.isActive !== 0;
  
//         return (
//           studentSchoolId === Number(detail.data?.sekolahId) &&
//           studentClassroomId === Number(props?.id) &&
//           isActive
//         );
//       });
//     }, [student.data, props.id, detail?.data?.sekolahId]);

//   return (
//     <div className="grid grid-cols-1 gap-4">
//       <div>
//         <Card className="w-full grid grid-cols-3 items-center justify-between">
//           <CardHeader className="border-r border-white/20">
//             <CardTitle>{detail.data?.namaKelas || "-"}</CardTitle>
//             <CardDescription>{`${detail?.data?.Sekolah?.namaSekolah || "-"}`}</CardDescription>
//           </CardHeader>
//           <CardHeader className="border-r border-white/20">
//             <CardTitle>{lang.text("student") || "-"}</CardTitle>
//             <CardDescription>{`${String(students.length) || "-"}`}</CardDescription>
//           </CardHeader>
//           <CardHeader className="border-r border-white/20">
//             <CardTitle>{lang.text("level") || "-"}</CardTitle>
//             <CardDescription>{`${detail.data?.level || "-"}`}</CardDescription>
//           </CardHeader>
//           {/* <CardContent>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                <CardHeader>
//                 <CardTitle>{detail.data?.namaKelas || "-"}</CardTitle>
//                 <CardDescription>{`${detail?.data?.Sekolah?.namaSekolah || "-"}`}</CardDescription>
//               </CardHeader>
//               <InfoItem
//                 icon={<Users size={24} />}
//                 label={lang.text("student")}
//                 value={String(students.length)}
//               />
//               <InfoItem
//                 icon={<BarChart size={24} />}
//                 label={lang.text("level")}
//                 value={detail.data?.level || "-"}
//               />
//             </div>
//           </CardContent> */}
//         </Card>
//       </div>
//     </div>
//   );
// };

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  lang,
} from "@/core/libs";
import { useBiodata } from "@/features/user/hooks";
import { useClassroomDetail } from "../hooks";
import { useEffect, useMemo, useState } from "react";

export interface ClassroomInformationProps {
  id?: number;
}

export const ClassroomInformation = (props: ClassroomInformationProps) => {
  const detail = useClassroomDetail({ id: Number(props.id) });
  const student = useBiodata();
  const [attendedUserIds, setAttendedUserIds] = useState<string[]>([]);

  // Inisialisasi dan bersihkan attendedUserIdsRemove di localStorage
  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    const storedDate = localStorage.getItem("attendanceDateRemove");
    let userIds = localStorage.getItem("attendedUserIdsRemove")
      ? JSON.parse(localStorage.getItem("attendedUserIdsRemove")!)
      : [];

    if (storedDate !== currentDate) {
      userIds = [];
      localStorage.setItem("attendanceDateRemove", currentDate);
      localStorage.setItem("attendedUserIdsRemove", JSON.stringify(userIds));
    }

    setAttendedUserIds(userIds);
  }, []);

  // Pengecekan berkala localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      const storedUserIds = localStorage.getItem("attendedUserIdsRemove");
      const userIds = storedUserIds ? JSON.parse(storedUserIds) : [];

      // Bandingkan dengan state saat ini untuk menghindari pembaruan yang tidak perlu
      if (JSON.stringify(userIds) !== JSON.stringify(attendedUserIds)) {
        setAttendedUserIds(userIds);
        student.query.refetch(); // Refetch data siswa
      }
    }, 5000); // Cek setiap 1 detik

    return () => clearInterval(interval); // Bersihkan interval saat unmount
  }, [attendedUserIds, student.query]);

  // Dengarkan perubahan localStorage untuk cross-tab updates
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUserIds = localStorage.getItem("attendedUserIdsRemove");
      const userIds = storedUserIds ? JSON.parse(storedUserIds) : [];
      setAttendedUserIds(userIds);
      student.query.refetch();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [student.query]);

  const students = useMemo(() => {
    let parsedData = [];

    try {
      parsedData = typeof student.data === "string" ? JSON.parse(student.data) : student.data || [];
    } catch (error) {
      console.error("Gagal parse student.data", error);
    }

    return parsedData?.filter((d) => {
      const studentSchoolId = Number(d?.user?.sekolah?.id);
      const studentClassroomId = Number(d?.kelas?.id);
      const isActive = d?.user?.isActive !== 0;
      const userId = String(d?.userId || d?.user?.id || d?.id); // Menangani userId atau id
      const validUserID = !attendedUserIds.includes(userId);

      return (
        studentSchoolId === Number(detail.data?.sekolahId) &&
        studentClassroomId === Number(props?.id) &&
        isActive &&
        validUserID
      );
    });
  }, [student.data, props.id, detail?.data?.sekolahId, attendedUserIds]);

  // Debug log untuk memantau perubahan
  console.log("attendedUserIds:", attendedUserIds);
  console.log("students.length:", students.length);
  console.log("student.data:", student.data);

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <Card className="w-full grid grid-cols-3 items-center justify-between">
          <CardHeader className="border-r border-white/20">
            <CardTitle>{detail.data?.namaKelas || "-"}</CardTitle>
            <CardDescription>{`${detail?.data?.Sekolah?.namaSekolah || "-"}`}</CardDescription>
          </CardHeader>
          <CardHeader className="border-r border-white/20">
            <CardTitle>{lang.text("student") || "-"}</CardTitle>
            <CardDescription>{`${String(students.length) || "-"}`}</CardDescription>
          </CardHeader>
          <CardHeader className="border-r border-white/20">
            <CardTitle>{lang.text("level") || "-"}</CardTitle>
            <CardDescription>{`${detail.data?.level || "-"}`}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};