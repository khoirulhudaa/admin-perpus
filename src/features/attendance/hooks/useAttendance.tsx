import { useContext } from 'react';
import { AttendanceContext } from '../context/AttendanceContext';

// Custom hook untuk mengakses data absensi dan fungsi pembaruan data
export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within AttendanceProvider');
  }
  return context;
};
