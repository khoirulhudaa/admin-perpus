import { Button, lang } from '@/core/libs';
import { BaseDataTable, useDataTableController } from '@/features/_global';
import { useStudentPagination } from '@/features/student';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useMemo } from 'react';
import { FaArrowDown } from 'react-icons/fa';
import { useSchool } from '../hooks';
import { schoolColumnsByProvince, schoolDataFallback } from '../utils';

interface SchoolByProvinceTableProps {
  onExport?: (data: any[]) => void;
  status?: string;
}

export const SchoolByProvinceTable = ({ onExport, status }: SchoolByProvinceTableProps) => {
  const school = useSchool();
  // const profile = useProfile();

  // console.log('school data this:', school)
  const { global, pagination } = useDataTableController({ defaultPageSize: 9999 });

  const studentParams = useMemo(
    () => ({
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      keyword: global,
    }),
    [pagination.pageIndex, pagination.pageSize, global]
  );

  const studentsPagination = useStudentPagination(studentParams);

  // Pastikan students adalah array, gunakan array kosong jika data belum ada
  const students = studentsPagination.data && Array.isArray(studentsPagination.data.students)
    ? studentsPagination.data.students
    : [];

    console.log('jumlah siswa', students)

  // Filter data berdasarkan status
  const filteredData = useMemo(() => {
    if (!school.data) return [];
    // Jika tidak ada status, tampilkan semua data
    const filtered = !status ? 
      school.data 
      : school.data.filter((item: any) => {
      status === 'Aktif' ? item.active === 1 : item.active === 0;
    });

    return filtered.map((item) => ({
      ...item,
      jumlahSiswa: students?.length
    }))
  }, [school.data, status]);

  // Data tabel yang akan diekspor
  const tableData = filteredData;
  console.log('Table data:', tableData);

  // Fungsi untuk ekspor ke PDF
  const exportToPDF = () => {
    if (school.query.isLoading || studentsPagination.isLoading) {
      alert('Data is still loading. Please wait.');
      return;
    }
    if (!tableData || tableData.length === 0) {
      alert('No data available to export.');
      return;
    }

    const doc = new jsPDF();
    doc.text('Laporan Data Sekolah', 14, 20);

    // Definisikan kolom berdasarkan struktur data
    const columns = [
      { header: 'No', dataKey: 'no' },
      { header: 'Nama Sekolah', dataKey: 'name' },
      { header: 'Provinsi', dataKey: 'province' },
    ];

    // Format data untuk tabel
    const data = tableData.map((item: any, index: number) => {
      const row = {
        no: index + 1,
        name: item.namaSekolah || '-',
        province: item.province?.name || '-',
      };
      return row;
    });

    // Terapkan autoTable ke dokumen
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

  return (
    <>
      <BaseDataTable
        students={students}
        columns={schoolColumnsByProvince}
        data={filteredData} // Gunakan filteredData, bukan school.data
        dataFallback={schoolDataFallback}
        globalSearch
        searchPlaceholder={lang.text('searchSchool')}
        isLoading={school.query.isLoading || studentsPagination.isLoading}
        searchParamPagination
      />
      {/* Tombol ekspor tersembunyi yang dipicu oleh tombol di ReportOverview */}
      <Button
        id='export-table'
        variant='ghost'
        onClick={() => {
          exportToPDF();
          if (onExport) onExport(tableData);
        }}
        className='hidden'
      >
        Export <FaArrowDown />
      </Button>
    </>
  );
};