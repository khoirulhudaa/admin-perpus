// import * as XLSX from "xlsx";

// export const downloadCSV = (data: any[][], filename: string) => {
//   const csvContent =
//     "data:text/csv;charset=utf-8," +
//     data.map((row) => row.join(",")).join("\n");
//   const encodedUri = encodeURI(csvContent);
//   const link = document.createElement("a");
//   link.setAttribute("href", encodedUri);
//   link.setAttribute("download", filename);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// export const downloadExcel = (
//   data: any[][],
//   filename: string,
//   sheetName: string = "Sheet1"
// ) => {
//   const worksheet = XLSX.utils.aoa_to_sheet(data);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
//   XLSX.writeFile(workbook, filename);
// };

// // Template berdasarkan file yang dikirim (baris ke-5 adalah header)
// export const studentTemplateHeaders = [
//   "No",
//   "Nama",
//   "NIPD",
//   "JK",
//   "NISN",
//   "Tempat Lahir",
//   "Tanggal Lahir",
//   "NIK",
//   "Agama",
//   "Alamat",
//   "RT",
//   "RW",
//   "Dusun",
//   "Kelurahan",
//   "Kecamatan",
//   "Kode Pos",
//   "Jenis Tinggal",
//   "Transportasi",
//   "No HP",
//   "No Telp",
//   "Email",
//   "SKHUN",
//   "No Seri Ijazah",
//   "Penerima KPS",
//   "No KPS",
//   "Nama Ayah",
//   "Tahun Lahir Ayah",
//   "Pendidikan Ayah",
//   "Pekerjaan Ayah",
//   "Penghasilan Ayah",
//   "Nama Ibu",
//   "Tahun Lahir Ibu",
//   "Pendidikan Ibu",
//   "Pekerjaan Ibu",
//   "Penghasilan Ibu",
//   "Nama Wali",
//   "Tahun Lahir Wali",
//   "Pendidikan Wali",
//   "Pekerjaan Wali",
//   "Penghasilan Wali",
//   "Jml. Saudara Kandung",
//   "Jarak Rumah ke Sekolah (KM)"
// ];

// export const getStudentTemplateData = () => {
//   return [studentTemplateHeaders];
// };
// utils/download.ts
import * as XLSX from "xlsx";

export const getStudentTemplateData = () => {
  return [
    ["Nama", "NIS", "NISN", "E-Mail"], // header sesuai struktur kamu
  ];
};

export const downloadCSV = (data: (string | number)[][], filename: string) => {
  const csvContent =
    "data:text/csv;charset=utf-8," + data.map((row) => row.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadExcel = (
  data: (string | number)[][],
  filename: string,
  sheetName = "Data"
) => {
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename);
};
