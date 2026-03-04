import { lang } from "@/core/libs";
import { getStaticFile } from "@/core/utils";
import { useProfile } from "@/features/profile"; // Asumsi useProfile diimpor dari folder yang sesuai
import { useEffect, useState } from "react";

export const SignatureDisplay = ({ signature }: { signature?: string }) => {
  const [userID, setUserID] = useState<string | null>(null); // Menyimpan userID
  const [schoolId, setSchoolId] = useState<string | null>(null); // Menyimpan schoolId
  const safeSignature = signature; // Menyimpan signature

  // Menggunakan hook useProfile untuk mendapatkan data profil
  const { query, ...profileData } = useProfile(); // Menggunakan query yang ada pada useProfile

  // Mendapatkan user ID dari localStorage

  // Mendapatkan schoolId dari data profil yang didapatkan dari useProfile
  useEffect(() => {
    if (profileData && profileData.user?.sekolah?.id) {
      setSchoolId(String(profileData.user.sekolah.id));
    }
  }, [profileData]);
  // console.log("🚀 ~ SignatureDisplay ~ profileData:", profileData);

  useEffect(() => {
    if (safeSignature && userID && schoolId) {
      // Simpan signature ke localStorage untuk user yang sesuai
      const existingSignature = localStorage.getItem(
        `schoolSignature_${userID}_${schoolId}`
      );
      if (existingSignature !== safeSignature) {
        localStorage.setItem(
          `schoolSignature_${userID}_${schoolId}`,
          safeSignature
        );
        // console.log(
        //   "✅ Signature disimpan di localStorage untuk user:",
        //   userID,
        //   "dan schoolId:",
        //   schoolId
        // );
      }
    }
  }, [safeSignature, userID, schoolId]);

  // Pastikan hanya menampilkan signature jika userId dan schoolId cocok
  const isSignatureValid = schoolId && safeSignature;

  return (
    <div className="border border-gray-400 rounded-md bg-transparent w-full h-[300px] flex justify-center items-center">
      {isSignatureValid ? (
        <img
          src={getStaticFile(safeSignature)}
          alt="Signature"
          className="object-contain"
          style={{
            backgroundColor: "#f5f5f5", // Latar belakang gambar
            maxWidth: "80%",
            height: "auto",
            margin: "auto",
            display: "block",
          }}
        />
      ) : (
        <span
          className="text-gray-500"
          style={{
            backgroundColor: "#f5f5f5", // Latar belakang fallback text
            padding: "10px",
            borderRadius: "5px",
            display: "inline-block",
          }}
        >
          {lang.text("noSignatureAvailable")}
        </span>
      )}
    </div>
  );
};
