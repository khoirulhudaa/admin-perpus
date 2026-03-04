import { BookCheck, ExternalLink, File, QrCode } from "lucide-react";
import { FaAndroid, FaApple, FaYoutube } from "react-icons/fa";

const features = [
  {
    title: "Tutorial Xpresensi (web admin)",
    description:
      "https://www.youtube.com/playlist?list=PLdT9I_K2UmNMRBwxsUb1mO6RJxz0Mc8wx",
    icon: <FaYoutube className="scale-[0.88] mb-1" />, // Ganti dengan path/icon Anda
  },
  {
    title: "Xpresensei (Android)",
    description:
      "https://play.google.com/store/apps/details?id=com.xpresensi&pli=1",
    icon: <FaApple className="scale-[0.88] mb-1" />, // Ganti dengan path/icon Anda
  },
  {
    title: "Xpresensi (IOS)",
    description:
      "https://apps.apple.com/id/app/xpresensi/id6743778548?l=id",
    icon: <FaAndroid className="scale-[0.88] mb-1" />,
  },
  {
    title: "Absensi Kiraproject",
    description:
      "https://absensi.kiraproject.id/auth/login",
    icon: <File className="scale-[1.7] mb-1"  />,
  },
  {
    title: "Absensi QR Kiraproject",
    description:
      "https://absensi.qr.kiraproject.id/",
    icon: <QrCode className="scale-[1.7] mb-1"  />,
  },
  {
    title: "Absensi Perpustakaan",
    description:
      "https://absensi.perpus.kiraproject.id/auth/login",
    icon: <BookCheck className="scale-[1.7] mb-1"  />,
  },
  {
    title: "Absensi v1 Perpustakaan",
    description:
      "https://Absensiv1.perpus.kiraproject.id",
    icon: <BookCheck className="scale-[1.7] mb-1" />,
  },
];

const ApplicationExpresensiLanding = () => {
  return (
    <div className="w-full pb-10">
      <div className="relative w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="relative border border:teal-800 dark:border-white/20 rounded-lg px-6 py-10 flex flex-col items-start text-white hover:shadow-lg transition"
          >
            <a href={feature.description} target="__blank">
              <div className="border-b border-l border-white/20 w-[50px] h-[50px] absolute top-0 right-0 flex items-center justify-center p-1 cursor-pointer active:scale-[0.99] hover:bg-white/10 hover:text-white duration-500">
                  <ExternalLink />
              </div>
            </a>
            <div className="absolute p-2 left-0 top-0 border-r border-b border-white/30 w-[66px] h-[66px] flex items-center justify-center">
              <p className="text-[50px] text-teal-500 darK:text-white">
                  {feature.icon}
              </p>
            </div>
            <h3 className="text-lg dark:text-white text-black font-semibold mb-2 mt-16">{feature.title}</h3>
            <a target="__blank" href={feature.description} className="text-sm text-blue-400">{feature.description}</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationExpresensiLanding;


// [08.23, 4/7/2025] Leader (Pak Andri wijaya): 1. 📲 Download aplikasi Xpresensi:
// 🔗 (Android) https://play.google.com/store/apps/details?id=com.xpresensi
// 🔗 (iOS) https://apps.apple.com/id/app/xpresensi/id6743778548?l=id
// [08.31, 4/7/2025] Leader (Pak Andri wijaya): Link untuk absen

//  1.absensi.kiraproject.id
// 2. Absensiqr.kiraproject.id 
// 3. Absensiv1.kiraproject.id
// 4. Absensi.perpus.kiraproject.id
// 5. Absensiv1.perpus.kiraproject.id