import { useBiodata } from "@/features/user/hooks";
import { tableColumnSiswa, tableColumnSiswaFallback } from "../utils";
import { BaseDataTable } from "@/features/_global";
import { useMemo } from "react";
import { BiodataSiswa } from "@/core/models/biodata";

export function TableDataSiswa() {
  const biodata = useBiodata();

  const datas = useMemo(() => {
    const studentWithAttendanceData: BiodataSiswa[] = [];

    biodata.data?.forEach((student) => {
      student.absensis?.forEach((studentAttendance) => {
        studentWithAttendanceData.push({
          ...student,
          attendance: studentAttendance,
        });
      });
    });

    return studentWithAttendanceData;
  }, [biodata.data]);

  return (
    <BaseDataTable
      columns={tableColumnSiswa}
      data={datas}
      dataFallback={tableColumnSiswaFallback}
      globalSearch={false}
      initialState={{
        columnVisibility: {
          user_name: true,
          user_email: false,
          user_nis: false,
          user_nisn: false,
          user_sekolah_namaSekolah: false,
          kelas_namaKelas: false,
          attendance_createdAt: false,
        },
        sorting: [
          {
            id: "attendance_createdAt",
            desc: true,
          },
        ],
      }}
      pageSize={5}
      isLoading={biodata.query.isLoading}
    />
  );
}
