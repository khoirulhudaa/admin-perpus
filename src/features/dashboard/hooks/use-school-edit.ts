import { useEffect, useState } from "react";
import { useProfile } from "@/features/profile";
import { useSchoolDetail } from "@/features/schools";

export const useSchoolUpdateDialog = () => {
  const profile = useProfile();
  const SchoolID = profile.user?.sekolahId;
  const school = useSchoolDetail({ id: SchoolID });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false); // Tambahan untuk mencegah perubahan isModalOpen

  useEffect(() => {
    if (!school.isLoading && !hasInitialized) {
      console.log("📌 [useSchoolUpdateDialog] Evaluating dialog open condition", {
        schoolData: school.data,
        isLoading: school.isLoading,
      });

      const hasShownDialog = localStorage.getItem("hasShownSchoolDialog") === "true";

      if (school.data) {
        const hasEmptyField =
          !school.data?.provinceId ||
          !school.data?.namaSekolah ||
          !school.data?.npsn ||
          !school.data?.alamatSekolah ||
          !school.data?.modelApiUrl ||
          !school.data?.tokenModel ||
          !school.data?.serverSatu ||
          !school.data?.serverDua ||
          !school.data?.serverTiga ||
          !school.data?.urlYutubeFirst ||
          !school.data?.urlYutubeSecond ||
          !school.data?.urlYutubeThird ||
          !school.data?.serverPerpustakaan ||
          !school.data?.namaPerpustakaan ||
          !school.data?.alamatSekolah ||
          school.data?.active === undefined ||
          school.data?.active === null ||
          !school.data?.latitude ||
          !school.data?.longitude;

        if (hasEmptyField && !hasShownDialog) {
          console.log("📌 [useSchoolUpdateDialog] Opening dialog: Empty fields detected and no prior dialog shown");
          setIsModalOpen(true);
          localStorage.setItem("hasShownSchoolDialog", "true");
        }
      } else {
        console.log("📌 [useSchoolUpdateDialog] Opening dialog: No school data found");
        if (!hasShownDialog) {
          setIsModalOpen(true);
          localStorage.setItem("hasShownSchoolDialog", "true");
        }
      }

      setHasInitialized(true); // Tandai bahwa inisialisasi selesai
    }
  }, [school.isLoading, school.data, hasInitialized]);

  const handleCloseDialog = () => {
    console.log("📌 [useSchoolUpdateDialog] Closing dialog via handleCloseDialog");
    setIsModalOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    console.log("📌 [useSchoolUpdateDialog] handleOpenChange called", { open });
    if (!open) {
      return; // Jangan izinkan penutupan dialog melalui klik di luar
    }
    setIsModalOpen(open);
  };

  return { isModalOpen, handleOpenChange, handleCloseDialog };
};  