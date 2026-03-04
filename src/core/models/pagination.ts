export interface Student {
    id: number;
    nama: string;
    nisn: string;
    kelas?: string;
    sekolah?: string;
    // tambah sesuai field yang dikembalikan dari API
  }
  
  export interface StudentPaginationResponse {
    students: Student[];
    keepPreviousData?: boolean;
    pagination: {
      page: number;
      size: number;
      totalItems: number;
      totalPages: number;
    };
  }
  