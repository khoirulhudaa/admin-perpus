import axios from "axios";

export const SLIMS_SERVERS = [
  "https://lib.sman1jkt.sch.id",
  "https://sman5-jkt.sch.id",
  "http://pustaka.sman40jkt.com",
  "https://absenrfid.kiraproject.id/attendance"
];

export const INLISLITE_SERVERS = [
  "https://inlislite.kiraproject.id",
  "https://pustaka.sman78library.or.id",
  "http://103.121.148.122:8123/inlislite3",
  "https://smkn13jkt.sch.id",
  "https://smkn13jkt.inlislite.xpresensi.com",
  "https://sman10jkt.inlislite.xpresensi.com"
];

export interface BookStats {
  totalBooks: number;
  borrowing: number;
  returned: number;
  available: number;
}

interface SlimsLoan {
  is_lent: string;
  is_return: string;
}

interface InliteLoan {
  LoanStatus: string;
  ActualReturn: string | null;
}

const getLibraryApiEndpoint = (server: string, type: 'books' | 'loans') => {
  if (SLIMS_SERVERS.includes(server)) {
    return type === 'books' 
      ? `${server}/index.php?p=api/books`
      : `${server}/index.php?p=api/loan/history`;
  }
  if (INLISLITE_SERVERS.includes(server)) {
    return type === 'books' 
      ? `${server}/api/web/v1/book`
      : `${server}/api/web/v1/peminjaman`;
  }
  return null;
};

export const fetchBookStats = async (
  server: string,
  sekolahId: number
): Promise<BookStats> => {
  if (!server?.startsWith("http")) {
    throw new Error("Invalid server URL");
  }

  const booksEndpoint = getLibraryApiEndpoint(server, 'books');
  const loansEndpoint = getLibraryApiEndpoint(server, 'loans');

  // Try INLISLITE fallback if endpoints not found
  if (!booksEndpoint || !loansEndpoint) {
    try {
      const [booksRes, loansRes] = await Promise.all([
        axios.get(`${server}/api/web/v1/book`, { params: { sekolahId } }),
        axios.get(`${server}/api/web/v1/peminjaman`, { params: { sekolahId } }),
      ]);

      const loans = loansRes.data.data as InliteLoan[];
      const borrowing = loans.filter(l => l.LoanStatus === "Loan").length;
      const returned = loans.filter(l => l.ActualReturn !== null).length;
      const totalBooks = booksRes.data.totalBooks || 15010;
      const available = totalBooks - (borrowing - returned);

      return {
        totalBooks,
        borrowing,
        returned,
        available: available <= 0 ? 0 : available,
      };
    } catch {}
  }

  // Try SLIMS fallback if INLISLITE fails
  try {
    const [booksRes, loansRes] = await Promise.all([
      axios.get(booksEndpoint!, { params: { sekolahId } }),
      axios.get(loansEndpoint!, { params: { sekolahId } }),
    ]);

    const loans = loansRes.data.data as SlimsLoan[];
    const borrowing = loans.filter(l => l.is_lent === "1").length;
    const returned = loans.filter(l => l.is_return === "1").length;
    const totalBooks = booksRes.data.totalBooks || 15010;
    const available = totalBooks - (borrowing - returned);

    return {
      totalBooks,
      borrowing,
      returned,
      available: available <= 0 ? 0 : available,
    };
  } catch (err: any) {
    console.warn("Fallback to default stats due to error:", err.message);
    return {
      totalBooks: 15010,
      borrowing: 0,
      returned: 0,
      available: 15010,
    };
  }
};
