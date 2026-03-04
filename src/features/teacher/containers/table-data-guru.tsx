import { useBiodataGuru } from "@/features/user/hooks";
import { BaseDataTable } from "@/features/_global";
import { tableColumnGuru, tableDataGuruFallback } from "../utils";
import { useMemo } from "react";
import { BiodataGuru } from "@/core/models/biodata-guru";
import { lang } from "@/core/libs";

export function TableDataGuru() {
  const biodata = useBiodataGuru();

  const datas = useMemo(() => {
    const dataWithAtt: BiodataGuru[] = [];

    biodata.data?.forEach((d) => {
      d.absensis?.forEach((ss) => {
        dataWithAtt.push({
          ...d,
          attendance: ss,
        });
      });
    });

    return dataWithAtt;
  }, [biodata.data]);

  return (
    <BaseDataTable
      columns={tableColumnGuru}
      data={datas}
      dataFallback={tableDataGuruFallback}
      globalSearch={false}
      initialState={{
        columnVisibility: {
          user_name: true,
          user_email: false,
          user_nip: false,
          user_nrk: false,
          user_sekolah_namaSekolah: false,
          user_nik: false,
          mataPelajaran_namaMataPelajaran: false,
          kode_guru: false,
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
