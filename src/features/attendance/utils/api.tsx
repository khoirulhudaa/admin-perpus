interface Attendance {
  user: {
    image: string;
    name: string;
    nisn: string;
  };
  kelas:
    | {
        namaKelas: string;
      }
    | string;
  absensis?: {
    statusKehadiran: string;
  }[];
}

// Adjust the import path as necessary

export const fetchClassesApi = async (): Promise<string[]> => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/kelas`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  const data = await response.json();
  if (!response.ok) throw new Error('Failed to fetch classes');
  return data.data.map((item: any) => item.namaKelas);
};

export const fetchBiodataApi = async (
  selectedClass: string,
): Promise<Attendance[]> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token found');

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/get-biodata-siswa-new`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch biodata: ${response.statusText}`);
  }

  const data = await response.json();

  // Normalize and filter data
  return (data.data || []).map((student: any) => ({
    user: {
      image: student.user?.image || '/defaultProfile.png',
      name: student.user?.name ?? 'Tidak Tersedia',
      nisn: student.user?.nisn ?? 'Tidak Tersedia',
    },
    kelas: student.kelas && typeof student.kelas === 'object' && student.kelas.namaKelas
      ? { namaKelas: student.kelas.namaKelas }
      : student.kelas || 'Tidak Tersedia',
    absensis: student.absensis || [],
  })).filter((student: Attendance) => {
    if (!selectedClass) return true;
    return typeof student.kelas === 'object'
      ? student.kelas.namaKelas === selectedClass
      : student.kelas === selectedClass;
  });
};

export const generateQrCodeApi = async (): Promise<string> => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/create-barcode-absen`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  const data = await response.json();
  if (!response.ok) throw new Error('Failed to generate QR Code');
  return data.data.token;
};

export const editCalendarEvent = async (
  id: number,
  updatedData: Partial<{
    note: string;
    description: string;
    startTime: string;
    endTime: string;
  }>,
): Promise<void> => {
  const token = localStorage.getItem('token');

  // Hanya kirim field yang berubah
  const filteredData = Object.fromEntries(
    Object.entries(updatedData).filter(([_, value]) => value !== undefined),
  );

  if (Object.keys(filteredData).length === 0) {
    console.warn('Tidak ada data yang diperbarui.');
    return;
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/calendar/${id}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filteredData),
    },
  );

  if (!response.ok) {
    throw new Error(`Gagal mengedit event ID ${id}`);
  }
};
