import { Button, lang } from '@/core/libs';
import { useProfile } from '@/features/profile';
import { useBiodata } from '@/features/user';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useMemo } from 'react';
import { FaArrowDown, FaSpinner } from 'react-icons/fa';
import { BaseDataTableProvince } from '../components';
import { useSchoolDetailNoRefetch } from '../hooks';
import { schoolColumnsByProvince, schoolDataFallback } from '../utils';

interface SchoolByProvinceTableProps {
  onExport?: (data: any[]) => void;
  status?: string;
}

export const SchoolByProvinceTable = ({ onExport, status }: SchoolByProvinceTableProps) => {
  const profile = useProfile();
  const students = useBiodata();
  // const school = useSchool()
  const school = useSchoolDetailNoRefetch({id: profile?.user?.sekolahId});
  
  // Filter data berdasarkan status
  const filteredData = useMemo(() => {
    if (!school?.data) return []; // Kembalikan array kosong jika data belum ada
    
    if (!status) return school.data;

    return school.data.filter((item: any) =>
      status === 'Aktif' ? item.active === 1 : item.active === 0
    );
  }, [status, school?.data]);

  console.log('school new::', school)

  const exportToPDF = () => {
    if (school.query.isLoading) {
      alert('Data is still loading. Please wait.');
      return;
    }
    if (!filteredData || filteredData.length === 0) {
      alert('No data available to export.');
      return;
    }

    const doc = new jsPDF();
    doc.text('Laporan Data Sekolah', 14, 20);

    const columns = [
      { header: 'No', dataKey: 'no' },
      { header: 'Nama Sekolah', dataKey: 'name' },
      { header: 'Provinsi', dataKey: 'province' },
    ];

    const data = filteredData.map((item: any, index: number) => ({
      no: index + 1,
      name: item.namaSekolah || '-',
      province: item.province?.name || '-',
    }));

    autoTable(doc, {
      columns,
      body: data,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 2 },
    });

    doc.save('data-sekolah.pdf');
  };

  if (school.query.isLoading) {
    return (
      <div className="flex mt-[150px] justify-center items-center text-gray-400">
        <FaSpinner className="animate-spin mr-2 text-blue-400" />
        {lang.text('loading')}
      </div>
    );
  }

  return (
    <>
      <BaseDataTableProvince
        // students={students?.data || []} // Default to empty array if undefined
        columns={schoolColumnsByProvince}
        data={filteredData}
        dataFallback={schoolDataFallback}
        globalSearch
        pageSize={8}
        searchPlaceholder={lang.text('searchSchool')}
        isLoading={school.query.isLoading}
        searchParamPagination
      />
      <Button
        id="export-table"
        variant="ghost"
        onClick={() => {
          exportToPDF();
          if (onExport) onExport(tableData);
        }}
        className="hidden"
      >
        Export <FaArrowDown />
      </Button>
    </>
  );
};