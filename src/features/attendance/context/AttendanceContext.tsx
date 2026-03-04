import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { BiodataSiswa } from '@/core/models/biodata';

// Context untuk menyimpan data absensi
export const AttendanceContext = createContext<
  | {
      attendanceData: BiodataSiswa[];
      updateAttendanceData: (newData: BiodataSiswa[]) => void;
    }
  | undefined
>(undefined);

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within AttendanceProvider');
  }
  return context;
};

// Provider untuk mengelola data absensi
export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
  const [attendanceData, setAttendanceData] = useState<BiodataSiswa[]>([]);

  const updateAttendanceData = useCallback((newData: BiodataSiswa[]) => {
    setAttendanceData(newData);
  }, []);

  return (
    <AttendanceContext.Provider
      value={{ attendanceData, updateAttendanceData }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};
