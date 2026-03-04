import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { dayjs, lang } from "@/core/libs";

export const HandleDownloadPDF = (datas: any[], schoolName: string | undefined, filterDate: string = dayjs().format('YYYY-MM-DD')) => {
  const doc = new jsPDF();

  console.log('Input datas:', datas);
  console.log('Filter date:', filterDate);

  // Format tanggal dan waktu saat ini
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const formattedDateTime = (schoolName ? schoolName : '') + ' - ' + now.toLocaleString("id-ID", options);

  // Add title
  doc.setFontSize(16);
  doc.text(`${lang.text('reportTeacherToday')}`, 14, 20);

  // Tambahkan tanggal dan waktu
  doc.setFontSize(10);
  doc.text(formattedDateTime, 14, 28);

  // Filter data for the specified date
  const tableData = datas
    .filter((data: any) => {
      const recordDate = dayjs(data.attendance?.createdAt).format('YYYY-MM-DD');
      console.log('Record createdAt:', data.attendance?.createdAt, 'Formatted:', recordDate);
      return recordDate === filterDate;
    })
    .map((data: any) => [
      data.namaGuru || '-',
      data.attendance?.statusKehadiran || '-',
      data.attendance?.jamMasuk ? dayjs(data.attendance.jamMasuk).format('HH:mm') : '-',
      data.attendance?.jamPulang ? dayjs(data.attendance.jamPulang).format('HH:mm') : '-'
    ]);

  console.log('Filtered tableData:', tableData);

  // Add table using autoTable
  autoTable(doc, {
    head: [['Nama', 'Status', 'Jam Masuk', 'Jam Pulang']],
    body: tableData.length > 0 ? tableData : [['No attendance records found for ' + filterDate, '', '', '']],
    startY: 34,
    theme: 'grid',
    headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
    styles: { fontSize: 10, cellPadding: 2 },
  });

  // Save the PDF
  doc.save(`Laporan-kehadiran-guru-${filterDate}.pdf`);
};