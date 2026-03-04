import { getToken } from "@/features/auth/utils";
import { APP_CONFIG } from "../configs/app";

export const getInitialOptions = () => {
  return {
    bearerToken: getToken(),
    credentials: "include",
  };
};

export const getStaticFile = (path: string, context?: string) => {
  // console.log("ada", path);
  if (path?.includes("static")) {
    return `${APP_CONFIG.staticUrl}/${path}`;
  }

  const oldStatic = "https://hris.sanivokasi.com/storage";

  if (path && context) {
    switch (context) {
      case "hadir":
        return `${oldStatic}/dokument/hadir/${path}`;
      case "cuti":
        return `${oldStatic}/cuti/${path}`;
      case "lembur":
        return `${oldStatic}/lembur/${path}`;
      case "photo":
        return `${oldStatic}/images/${path}`;
    }
  }

  if (!path.includes("base64")) {
    return `data:image/jpeg;base64,${path}`; // Menampilkan gambar base64
  }

  if (path.includes("base64")) {
    return path;
  }

  return "";
};
