import React, { useMemo } from 'react';
import { StudentMoodleTable } from '../containers';
import { useParamDecode } from '@/features/_global';
import { useBiodata } from '@/features/user/hooks';

export const StudentMoodles = React.memo(() => {
  const { decodeParams } = useParamDecode();
  const biodata = useBiodata();

  // Log untuk decodeParams
  console.log('🚀 ~ decodeParams:', decodeParams);

  // Ambil ID siswa dari decodeParams
  const studentId = decodeParams?.id;
  console.log('🚀 ~ Student ID:', studentId);

  // Log data biodata yang diterima
  console.log('🚀 ~ Biodata fetched:', biodata.data);

  // Cari data siswa di biodata berdasarkan ID
  const detail = useMemo(() => {
    const student = biodata.data?.find((d) => d.id === Number(studentId));
    console.log('🚀 ~ Student found in biodata:', student);

    if (!student) {
      console.error('Siswa tidak ditemukan di biodata.');
      return null;
    }

    const detailData = {
      id: student.id,
      data: {
        user: {
          sekolahId: student.user?.sekolah?.id || 0,
          nis: Number(student.user?.nis) || 0, // Konversi ke number
        },
      },
    };

    // Log detail data yang dikonstruksi
    console.log('🚀 ~ Detail Data constructed:', detailData);
    return detailData;
  }, [biodata.data, studentId]);

  if (!detail) {
    console.warn('🚀 ~ Data siswa tidak ditemukan.');
    return <div>Data siswa tidak ditemukan. Silakan cek kembali.</div>;
  }

  // Log detail data yang diteruskan ke StudentMoodleTable
  console.log('🚀 ~ Detail Data passed to StudentMoodleTable:', detail);

  return (
    <div>
      {/* Render tabel dengan data siswa */}
      <StudentMoodleTable detail={detail} />
    </div>
  );
});

export default StudentMoodles;
