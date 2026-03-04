// import {
//   studentCoursePresenceColumn,
//   tableColumnSiswaFallback,
// } from "../utils";
// import { BaseDataTable } from "@/features/_global";
// import { lang } from "@/core/libs";
// import { useMemo } from "react";
// import { useStudentDetail } from "../hooks";
// import { StudentCoursePresenceDataModel } from "@/core/models/biodata";

// export interface StudentCoursePresenceTableProps {
//   id?: number;
// }

// export function StudentCoursePresenceTable(
//   props: StudentCoursePresenceTableProps,
// ) {
//   const detail = useStudentDetail({ id: props?.id });
//   const items = useMemo(() => {
//     const coursePresences: StudentCoursePresenceDataModel[] = [];
//     detail?.data?.kehadiranBulananMataPelajaran?.forEach((d) => {
//       d?.absensisMataPelajaran?.forEach((e) => {
//         coursePresences.push({ ...e, periode: d });
//       });
//     });

//     return coursePresences;
//   }, [detail?.data?.kehadiranBulananMataPelajaran]);


//   console.log('items course:', items)
//   return (
//     <BaseDataTable
//       columns={studentCoursePresenceColumn}
//       data={items}
//       dataFallback={tableColumnSiswaFallback}
//       globalSearch
//       // searchParamPagination
//       // showFilterButton
//       searchPlaceholder={lang.text("search")}
//       isLoading={detail.query.isLoading}
//     />
//   );
// }


import {
  studentCoursePresenceColumn,
  StudentCoursePresencePDF,
  tableColumnSiswaFallback,
} from "../utils";
import { BaseDataTable } from "@/features/_global";
import { Button, lang } from "@/core/libs";
import { useMemo } from "react";
import { useStudentDetail } from "../hooks";
import { StudentCoursePresenceDataModel } from "@/core/models/biodata";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FaFilePdf } from "react-icons/fa";
import { useSchool } from "@/features/schools";

export interface StudentCoursePresenceTableProps {
  id?: number;
}

export function StudentCoursePresenceTable(
  props: StudentCoursePresenceTableProps,
) {
  const detail = useStudentDetail({ id: props?.id });
  const school = useSchool();

  const items = useMemo(() => {
    const coursePresences: StudentCoursePresenceDataModel[] = [];
    detail?.data?.kehadiranBulananMataPelajaran?.forEach((d) => {
      d?.absensisMataPelajaran?.forEach((e) => {
        coursePresences.push({ ...e, periode: d });
      });
    });

    return coursePresences;
  }, [detail?.data?.kehadiranBulananMataPelajaran]);

  return (
    <>
      <div className="flex justify-start mb-1">
        {items.length > 0 ? (
          <PDFDownloadLink
            document={
            <StudentCoursePresencePDF 
              data={items}
              school={{
                namaSekolah: school?.data?.[0]?.namaSekolah ?? 'Nama Sekolah',
                kopSurat: school.data?.[0]?.kopSurat ?? '',
                namaKepalaSekolah: school.data?.[0].namaKepalaSekolah ?? '',
                ttdKepalaSekolah: school.data?.[0].ttdKepalaSekolah ?? '',
              }} 
            />}
            fileName="laporan-kehadiran-siswa.pdf"
          >
            {({ loading }) => (
              <Button disabled={loading} className="flex items-center bg-red-600 text-white gap-3 mb-3 hover:bg-red-700">
                {loading ? lang.text('progress') : lang.text('downloadPDF')}
                <FaFilePdf />
              </Button>
            )}
          </PDFDownloadLink>
        ):
            <Button
              variant="outline"
              disabled
              className="flex items-center bg-red-600 text-white gap-3 mb-3 hover:bg-red-700 cursor-not-allowed"
            >
              {lang.text('downloadPDF')}
              <FaFilePdf />
            </Button>
        }
      </div>

      <BaseDataTable
        columns={studentCoursePresenceColumn}
        data={items}
        dataFallback={tableColumnSiswaFallback}
        globalSearch
        searchPlaceholder={lang.text("search")}
        isLoading={detail.query.isLoading}
      />
    </>
  );
}
