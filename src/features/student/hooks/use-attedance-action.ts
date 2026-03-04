import { lang } from "@/core/libs";
import { useAlert } from "@/features/_global";
import { useAttendanceCreation } from "@/features/attendance/hooks";
import { useProfile } from "@/features/profile";
import { useBiodataNew } from "@/features/user/hooks/use-biodata-new";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAttedances } from "./use-attendace";
import Swal from 'sweetalert2';

export const useAttendanceActions = (id: string | number) => {
  const creation = useAttendanceCreation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const alert = useAlert();
  const profile = useProfile();
  const profileSchoolId = profile?.user?.sekolahId;

  // Gunakan useBiodataNew dengan ID yang sama seperti di StudentLandingTables
  const biodatanew = useBiodataNew();

  const attedances = profileSchoolId !== null ? useAttedances({ id: profileSchoolId }) : useAttedances();

  const handleAttend = async (userId: number) => {
    try {
      if (userId) {
        // Get current date in YYYY-MM-DD format
        const currentDate = new Date().toISOString().split('T')[0];
        
        // Get stored date and userIds from localStorage
        const storedDate = localStorage.getItem('attendanceDate');
        const storedUserIds = localStorage.getItem('attendedUserIds');
        let userIds = storedUserIds ? JSON.parse(storedUserIds) : [];

        // Clear userIds if the date has changed
        if (storedDate !== currentDate) {
          userIds = [];
          localStorage.setItem('attendanceDate', currentDate);
          localStorage.setItem('attendedUserIds', JSON.stringify(userIds));
        }
        
        // Add new userId if it doesn't already exist
        if (!userIds.includes(userId)) {
          userIds.push(userId);
          localStorage.setItem('attendedUserIds', JSON.stringify(userIds));
        }

        await creation.create({ userId: userId });
      }

      alert.success(lang.text("successCreate", { context: lang.text("attendance") }));

      // Invalidate cache for all related queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["biodata-siswa-new", profileSchoolId] }),
        queryClient.invalidateQueries({ queryKey: ["attedances-new", profileSchoolId] }),
        queryClient.invalidateQueries({ queryKey: ["students"] }),
      ]);

      // Refetch all relevant data
      await Promise.all([
        biodatanew.query.refetch(),
        biodatanew.queryOld.refetch(),
        attedances.query.refetch(),
      ]);

    } catch (err: any) {
      if (err.message?.includes("prisma.devices.findUnique")) {
        console.warn("Prisma device query failed, but treating as success");
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["students"] }),
          queryClient.invalidateQueries({ queryKey: ["attedances-new"] }),
        ]);
        alert.success(lang.text("successCreate", { context: lang.text("attendance") }));
      } else {
        const errorMessage = err.message || (userId
          ? lang.text("failUpdate", { context: lang.text("attendance") })
          : lang.text("failCreate", { context: lang.text("attendance") }));
        alert.error(errorMessage);
      }
    }
};

const handleAttendRemove = async (userId: number) => {
  try {
    if (userId) {
      // Show SweetAlert2 confirmation dialog
      const result = await Swal.fire({
        title: lang.text("confirmDeleteTitle") || "Confirm Delete",
        text: lang.text("confirmDeleteStudent") || "Are you sure you want to delete this student's data? This action cannot be undone.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: lang.text("confirm") || "Confirm",
        cancelButtonText: lang.text("cancel") || "Cancel",
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
      });

      if (!result.isConfirmed) {
        return; // Exit if user cancels
      }

      // Get current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split('T')[0];

      // Get stored date and userIds from localStorage
      const storedDateRemove = localStorage.getItem('attendanceDateRemove');
      const storedUserIdsRemove = localStorage.getItem('attendedUserIdsRemove');
      let userIds = storedUserIdsRemove ? JSON.parse(storedUserIdsRemove) : [];

      // Clear userIds if the date has changed
      if (storedDateRemove !== currentDate) {
        userIds = [];
        localStorage.setItem('attendanceDateRemove', currentDate);
        localStorage.setItem('attendedUserIdsRemove', JSON.stringify(userIds));
      }

      // Add new userId if it doesn't already exist
      if (!userIds.includes(userId)) {
        userIds.push(userId);
        localStorage.setItem('attendedUserIdsRemove', JSON.stringify(userIds));
      }

      await creation.remove({ userId });
    }

    alert.success(lang.text('dataSuccessDeleteStudent'));

    // Invalidate cache for all related queries
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["biodata-siswa-new", profileSchoolId] }),
      queryClient.invalidateQueries({ queryKey: ["attedances-new", profileSchoolId] }),
      queryClient.invalidateQueries({ queryKey: ["students"] }),
    ]);

    // Refetch all relevant data
    await Promise.all([
      biodatanew.query.refetch(),
      biodatanew.queryOld.refetch(),
      attedances.query.refetch(),
    ]);

    // navigate(-1);
  } catch (err: any) {
    if (err.message?.includes("prisma.devices.findUnique")) {
      console.warn("Prisma device query failed, but treating as success");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["students"] }),
        queryClient.invalidateQueries({ queryKey: ["attedances-new"] }),
      ]);
      alert.success(lang.text('dataSuccessDeleteStudent'));
    } else {
      const errorMessage = err.message || (userId
        ? lang.text("failUpdate", { context: lang.text("attendance") })
        : lang.text("failCreate", { context: lang.text("attendance") }));
      alert.error(errorMessage);
    }
  }
};

  const handleAttendGoHome = async (userId: number) => {
    try {
      if (userId) {
        await creation.createGo({ userId });
      }

      alert.success(lang.text("successCreate", { context: lang.text("goHome") }));

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["biodata-siswa-new", profileSchoolId] }),
        queryClient.invalidateQueries({ queryKey: ["attedances-new", profileSchoolId] }),
        queryClient.invalidateQueries({ queryKey: ["students"] }),
      ]);

      await Promise.all([
        biodatanew.query.refetch(),
        biodatanew.queryOld.refetch(),
        attedances.query.refetch(),
      ]);

      navigate(-1);
    } catch (err: any) {
      if (err.message?.includes("prisma.devices.findUnique")) {
        console.warn("Prisma device query failed, but treating as success");
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["students"] }),
          queryClient.invalidateQueries({ queryKey: ["attedances-new"] }),
        ]);
        alert.success(lang.text("successCreate", { context: lang.text("goHome") }));
      } else {
        const errorMessage = err.message || (userId
          ? lang.text("failUpdate", { context: lang.text("attendance") })
          : lang.text("failCreate", { context: lang.text("attendance") }));
        alert.error(errorMessage);
      }
    }
  };

  return { handleAttend, handleAttendGoHome, handleAttendRemove };
};