// import { lang } from '@/core/libs';
// import { BaseDataTable } from '@/features/_global';
// import { parentColumnWithFilter, useParent } from '@/features/parents';
// import { useSchool } from '@/features/schools';
// import { useBiodata } from '@/features/user/hooks';
// import { useMemo } from 'react';

// export interface StudentParentTableProps {
//   id?: number;
// }

// export function StudentParentTable(props: StudentParentTableProps) {
//   const parent = useParent();
//   const student = useBiodata();
//   const school = useSchool();

//   const detail = useMemo(
//     () => student?.data?.find((d) => Number(d.id) === Number(props.id)),
//     [props.id, student.data],
//   );

//   const parentNik = detail?.orangTua?.[0]?.user?.nik;

//   const datas = useMemo(() => {
//     return parent.data
//       ?.filter((d) => d.nik === parentNik)
//       ?.map((d) => {
//         return {
//           ...d,
//           student: student.data?.find((e) =>
//             Boolean(e.orangTua?.find((f) => f.user?.nik === d.nik)),
//           ),
//           school: school.data?.find(
//             (e) => Number(e.id) === Number(d.sekolahId),
//           ),
//         };
//       });
//   }, [parent.data, parentNik, school.data, student.data]);

//   const columns = useMemo(() => {
//     return parentColumnWithFilter();
//   }, []);

//   console.log('datas', datas)

//   return (
//     <BaseDataTable
//       columns={columns}
//       data={datas}
//       dataFallback={[]}
//       globalSearch={false}
//       // searchParamPagination
//       // showFilterButton
//       searchPlaceholder={lang.text('search')}
//       isLoading={
//         parent.query.isLoading || student.isLoading || school.isLoading
//       }
//     />
//   );
// }


import { Button, lang } from '@/core/libs';
import { BaseDataTable } from '@/features/_global';
import { parentColumnWithFilter, useParent } from '@/features/parents';
import { useSchool } from '@/features/schools';
import { useBiodata } from '@/features/user/hooks';
import { useMemo } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { StudentParentPDF } from '../utils';
import { FaFilePdf } from 'react-icons/fa';

export interface StudentParentTableProps {
  id?: number;
}

export function StudentParentTable(props: StudentParentTableProps) {
  const parent = useParent();
  const student = useBiodata();
  const school = useSchool();

  const detail = useMemo(
    () => student?.data?.find((d) => Number(d.id) === Number(props.id)),
    [props.id, student.data],
  );

  const parentNik = detail?.orangTua?.[0]?.user?.nik;

  const datas = useMemo(() => {
    return parent.data
      ?.filter((d) => d.nik === parentNik)
      ?.map((d) => {
        return {
          ...d,
          student: student.data?.find((e) =>
            Boolean(e.orangTua?.find((f) => f.user?.nik === d.nik)),
          ),
          school: school.data?.find(
            (e) => Number(e.id) === Number(d.sekolahId),
          ),
        };
      });
  }, [parent.data, parentNik, school.data, student.data]);

  const columns = useMemo(() => {
    return parentColumnWithFilter();
  }, []);

  return (
    <>
      <div className="flex justify-start mb-1">
        {datas && datas.length > 0 && (
          <PDFDownloadLink
            document={<StudentParentPDF data={datas} 
            school={{
              namaSekolah: school.data?.[0].namaSekolah,
              kopSurat: school.data?.[0].kopSurat,
              namaKepalaSekolah: school.data?.[0].namaKepalaSekolah,
              ttdKepalaSekolah: school.data?.[0].ttdKepalaSekolah,
            }}
          />}
            fileName="data-orang-tua-dan-siswa.pdf"
          >
            {({ loading }) => (
              <Button disabled={loading} className="flex items-center bg-red-600 text-white gap-3 mb-3 hover:bg-red-700">
                {loading ? lang.text('progress') : lang.text('downloadPDF')}
                <FaFilePdf />
              </Button>
            )}
          </PDFDownloadLink>
        )}
      </div>

      <BaseDataTable
        columns={columns}
        data={datas}
        dataFallback={[]}
        globalSearch={false}
        searchPlaceholder={lang.text('search')}
        isLoading={
          parent.query.isLoading || student.isLoading || school.isLoading
        }
      />
    </>
  );
}
