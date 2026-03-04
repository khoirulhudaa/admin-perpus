// import { Button, dayjs, lang } from '@/core/libs';
// import { BaseDataTable } from '@/features/_global';
// import { useSchool } from '@/features/schools';
// import { pdf } from '@react-pdf/renderer';
// import { useMemo } from 'react';
// import { FaFilePdf } from 'react-icons/fa';
// import {
//   studentDailyPresenceColumn,
//   StudentPresencePDF,
//   tableColumnSiswaFallback,
// } from '../../student/utils';
// import { useAbsensiUserDetail } from '../hooks/use-absen-student-detail';

// export function StudentDailyPresenceTable(
//   props: any,
// ) {
//   const detail = useAbsensiUserDetail({ id: props?.id });
//   const school = useSchool(); // Ambil data sekolah untuk kop dan ttd
//   const items = useMemo(() => detail.data || [], [detail?.data]);
  
//   console.log('data absen detail siswa:', props?.id)
//   console.log('data absen detail siswa:', detail)

//   const handleDownloadPDF = async () => {
//     if (!school.data?.[0]) return;
//     console.log('school', school)
//     const doc = (
//       <StudentPresencePDF
//         data={items}
//         school={{
//           namaSekolah: school?.data?.[0]?.namaSekolah ?? 'Nama Sekolah',
//           kopSurat: school.data?.[0]?.kopSurat ?? '',
//           namaKepalaSekolah: school.data?.[0].namaKepalaSekolah,
//           ttdKepalaSekolah: school.data?.[0].ttdKepalaSekolah,
//         }}
//       />
//     );

//     const instance = pdf(doc);
//     const blob = await instance.toBlob();
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `Laporan-Absensi-${dayjs().format('YYYY-MM-DD')}.pdf`;
//     link.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <>
//       {
//         items?.length === 0 ? (
//           <Button disabled={true} className='flex items-center gap-3 mt-[5px] mb-4 bg-red-600 hover:bg-red-700 text-white cursor-not-allowed'>
//             {lang.text('downloadPDF')}
//             <FaFilePdf />
//           </Button>
//         ):
//           <Button onClick={handleDownloadPDF} className='flex items-center gap-3 mt-[5px] mb-4 bg-red-600 hover:bg-red-700 text-white'>
//             {lang.text('downloadPDF')}
//             <FaFilePdf />
//           </Button>
//       }
//       <BaseDataTable
//         columns={studentDailyPresenceColumn}
//         data={items}
//         dataFallback={tableColumnSiswaFallback}
//         globalSearch={false}
//         initialState={{
//           sorting: [{ id: 'createdAt', desc: true }],
//         }}
//         searchPlaceholder={lang.text('search')}
//         isLoading={detail.query.isLoading}
//       />
//     </>
//   );
// }


import { Button, dayjs, lang, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/libs';
import { BaseDataTable } from '@/features/_global';
import { useSchool } from '@/features/schools';
import { pdf } from '@react-pdf/renderer';
import { useMemo, useState } from 'react';
import { FaFilePdf } from 'react-icons/fa';

import {
  studentDailyPresenceColumn,
  StudentPresencePDF,
  tableColumnSiswaFallback,
} from '../../student/utils';
import { useAbsensiUserDetail } from '../hooks/use-absen-student-detail';

export function StudentDailyPresenceTable(props: { id?: number }) {
  const [filter, setFilter] = useState<'harian' | 'bulanan' | 'tahunan'>('bulanan');
  const detail = useAbsensiUserDetail({ id: props?.id, filter });
  const school = useSchool();
  const items = useMemo(() => detail.data || [], [detail?.data]);

  console.log('data absen detail siswa:', props?.id);
  console.log('data absen detail siswa:', detail?.data);

  const handleDownloadPDF = async () => {
    if (!school.data?.[0]) return;
    console.log('school', school);
    const doc = (
      <StudentPresencePDF
        data={items}
        school={{
          namaSekolah: school?.data?.[0]?.namaSekolah ?? 'Nama Sekolah',
          kopSurat: school.data?.[0]?.kopSurat ?? '',
          namaKepalaSekolah: school.data?.[0].namaKepalaSekolah,
          ttdKepalaSekolah: school.data?.[0].ttdKepalaSekolah,
        }}
        filter={filter}
      />
    );

    const instance = pdf(doc);
    const blob = await instance.toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan-Absensi-${filter}-${dayjs().format('YYYY-MM-DD')}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="flex items-center gap-3 mt-[5px] mb-4">
        <Select value={filter} onValueChange={(value: 'harian' | 'bulanan' | 'tahunan') => setFilter(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Pilih filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="harian">Harian</SelectItem>
            <SelectItem value="bulanan">Bulanan</SelectItem>
            <SelectItem value="tahunan">Tahunan</SelectItem>
          </SelectContent>
        </Select>
        {items?.length === 0 ? (
          <Button disabled className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white cursor-not-allowed">
            {lang.text('downloadPDF')}
            <FaFilePdf />
          </Button>
        ) : (
          <Button onClick={handleDownloadPDF} className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white">
            {lang.text('downloadPDF')}
            <FaFilePdf />
          </Button>
        )}
      </div>
      <BaseDataTable
        columns={studentDailyPresenceColumn}
        data={items}
        dataFallback={tableColumnSiswaFallback}
        globalSearch={false}
        initialState={{
          sorting: [{ id: 'createdAt', desc: true }],
        }}
        searchPlaceholder={lang.text('search')}
        isLoading={detail.query.isLoading}
      />
    </>
  );
}