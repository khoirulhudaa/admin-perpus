// utils/import.ts
import * as XLSX from 'xlsx';

export const parseExcelFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      resolve(json);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const validateStudentData = (rows: any[][]) => {
  const [header, ...data] = rows;
  const requiredFields = ['Nama Siswa', 'Email', 'NIS', 'NISN'];
  const valid = [];
  const invalid = [];

  for (const row of data) {
    const rowData = Object.fromEntries(header.map((key, i) => [key, row[i]]));
    const isValid = requiredFields.every((field) => !!rowData[field]);

    if (isValid) valid.push(rowData);
    else invalid.push(rowData);
  }

  return { valid, invalid };
};
