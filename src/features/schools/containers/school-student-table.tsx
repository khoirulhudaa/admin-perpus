import { Input, lang } from '@/core/libs';
import { BaseDataTable } from '@/features/_global';
import { useSchool } from '@/features/schools';
import { studentColumnWithFilter, tableColumnSiswaFallback } from '@/features/student';
import { useBiodata } from '@/features/user/hooks';
import { useMemo, useState } from 'react';
import { StudentMoodleTable } from '../../student/containers/student-moodle';
interface Detail {
  id: number;
  data: {
    user: {
      sekolahId: number;
      nis: number;
    };
  };
}

// Define interface for biodata.data
interface Biodata {
  id: number;
  user: {
    id?: number;
    name?: string;
    email?: string;
    nis?: string | number;
    nisn?: string | number;
    sekolah?: { id: number };
    isActive: number;
  };
  biodataSiswa?: { id: number; kelas?: { namaKelas: string } }[];
  name?: string;
  email?: string;
  nis?: string | number;
  nisn?: string | number;
}

export function SchoolStudentTable() {
  const biodata = useBiodata();
  const school = useSchool();
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search input
  const [selectedStudent, setSelectedStudent] = useState<Detail | null>(null);

  // Parse biodata.data if it's a string
  const parsedBiodata = useMemo(() => {
    if (typeof biodata.data === 'string') {
      try {
        return JSON.parse(biodata.data) as Biodata[];
      } catch (error) {
        console.error('Error parsing biodata.data:', error);
        return [];
      }
    }
    return (biodata.data || []) as Biodata[];
  }, [biodata.data]);

  const columns = useMemo(() => {
    const columnData = studentColumnWithFilter({
      noStatus: true,
      schoolOptions:
        school.data?.map((d) => ({
          label: d.namaSekolah,
          value: d.namaSekolah,
        })) || [],
    });
    return columnData.filter((column) => column.accessorKey !== 'kelas') && columnData.filter((column) => column.accessorKey !== 'action') ;
  }, [school.data]);

  // Fungsi untuk menangani klik pada siswa
  const handleStudentClick = (student: Biodata) => {
    const studentDetail: Detail = {
      id: student.id,
      data: {
        user: {
          sekolahId: student.user?.sekolah?.id || 0,
          nis: Number(student.user?.nis || student.nis) || 0,
        },
      },
    };
    setSelectedStudent(studentDetail);
  };

  // Filter data based on search term
  const filteredData = useMemo(() => {
    const data = parsedBiodata.filter((data: Biodata) => data?.user?.isActive !== 0);
    if (!searchTerm) return data;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.filter((item: Biodata) => {
      const name = (item.user?.name || item.name || '').toLowerCase();
      const nis = String(item.user?.nis || item.nis || '').toLowerCase();
      const nisn = String(item.user?.nisn || item.nisn || '').toLowerCase();
      return (
        name.includes(lowerSearchTerm) ||
        nis.includes(lowerSearchTerm) ||
        nisn.includes(lowerSearchTerm)
      );
    });
  }, [parsedBiodata, searchTerm]);

  return (
    <div>
      {/* Custom Search Input */}
      <div className="mb-4">
        <Input
          placeholder={lang.text('searchByNameOrNISNISN')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-[300px]"
        />
      </div>
      <BaseDataTable
        columns={columns}
        data={filteredData}
        dataFallback={tableColumnSiswaFallback}
        globalSearch={false}
        searchParamPagination
        searchPlaceholder={lang.text('search')}
        isLoading={biodata.query.isLoading}
        onRowClick={handleStudentClick}
      />
      {selectedStudent && (
        <div style={{ marginTop: '20px' }}>
          <h3>Detail Siswa</h3>
          <StudentMoodleTable detail={selectedStudent} />
        </div>
      )}
    </div>
  );
}