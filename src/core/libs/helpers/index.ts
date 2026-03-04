export const getDeviceInfo = (): string => {
  const userAgent = navigator.userAgent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userAgentData = (navigator as any).userAgentData; // Optional chaining untuk browser modern

  // Default values
  let browser = "Unknown Browser";
  let os = "Unknown OS";
  let deviceType = "Desktop";

  // Browser detection
  if (/chrome|chromium|crios/i.test(userAgent)) {
    browser = "Google Chrome";
  } else if (/firefox|fxios/i.test(userAgent)) {
    browser = "Mozilla Firefox";
  } else if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent)) {
    browser = "Apple Safari";
  } else if (/edg/i.test(userAgent)) {
    browser = "Microsoft Edge";
  } else if (/opr\//i.test(userAgent)) {
    browser = "Opera";
  } else if (/msie|trident/i.test(userAgent)) {
    browser = "Internet Explorer";
  }

  // OS detection
  if (/windows/i.test(userAgent)) {
    os = "Windows";
  } else if (/macintosh|mac os x/i.test(userAgent)) {
    os = "macOS";
  } else if (/linux/i.test(userAgent)) {
    os = "Linux";
  } else if (/android/i.test(userAgent)) {
    os = "Android";
  } else if (/iphone|ipad|ipod/i.test(userAgent)) {
    os = "iOS";
  }

  // Device type detection
  if (/mobile/i.test(userAgent)) {
    deviceType = "Mobile";
  } else if (/tablet/i.test(userAgent)) {
    deviceType = "Tablet";
  }

  // Modern detection with userAgentData (if supported)
  if (userAgentData?.mobile) {
    deviceType = userAgentData.mobile ? "Mobile" : "Desktop";
  }

  return `${browser};${os};${deviceType};${userAgent}`;
};

export const jsonHelper = {
  parse: (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch (err) {
      console.error("jsonHelper -> parse -> error ->", err);
      return null;
    }
  },
  string: (obj: unknown) => {
    try {
      return JSON.stringify(obj);
    } catch (err) {
      console.error("jsonHelper -> string -> error ->", err);
      return "";
    }
  },
};

export function searchParamsToObject(
  searchParams: string,
): Record<string, string> {
  const params = new URLSearchParams(searchParams);
  const obj: Record<string, string> = {};
  for (const [key, value] of params) {
    obj[key] = value;
  }
  return obj;
}

export type ParamType = Record<string, string | number | undefined | null>;

export function objectToSearchParams(obj?: ParamType): string {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    return "";
  }

  const params = new URLSearchParams();
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (typeof value === "string" || typeof value === "number") {
      params.append(key, value.toString());
    }
  });

  return params.toString();
}

export function slugify(str: string): string {
  return str
    .toLowerCase() // Ubah semua huruf menjadi kecil
    .trim() // Hapus spasi di awal dan akhir string
    .replace(/[^a-z0-9\s-]/g, "") // Hapus karakter non-alfanumerik kecuali spasi dan tanda hubung
    .replace(/\s+/g, "-") // Ganti spasi dengan tanda hubung
    .replace(/-+/g, "-") // Ganti tanda hubung berulang dengan satu tanda hubung
    .replace(/^-+|-+$/g, ""); // Hapus tanda hubung di awal atau akhir string
}

export function deslugify(slug: string): string {
  return slug
    .replace(/-/g, " ") // Ganti tanda hubung dengan spasi
    .replace(/\s+/g, " ") // Ganti spasi berulang dengan satu spasi
    .replace(/^\s+|\s+$/g, "") // Hapus spasi di awal dan akhir string
    .replace(/\s([a-z])/g, (match) => match.toUpperCase()) // Kapitalisasi huruf pertama setelah spasi
    .replace(/^[a-z]/, (match) => match.toUpperCase()); // Kapitalisasi huruf pertama pada kata pertama
}

// Fungsi untuk membuat array objek distinct berdasarkan properti tertentu
export function distinctObjectsByProperty<T extends object, K extends keyof T>(
  arr: T[],
  prop: K,
): T[] {
  return Array.from(
    arr
      .reduce((map, item) => map.set(item[prop], item), new Map<T[K], T>())
      .values(),
  );
}

export function resolveUrl(input: string): string {
  // Regular expression untuk memeriksa apakah input adalah alamat IP
  const ipRegex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  // Regular expression untuk memeriksa apakah input dimulai dengan http:// atau https://
  const protocolRegex = /^https?:\/\//i;

  if (ipRegex.test(input)) {
    // Jika input adalah alamat IP, tambahkan "http://"
    return `http://${input}`;
  } else if (!protocolRegex.test(input)) {
    // Jika input tidak dimulai dengan http:// atau https://, tambahkan "https://"
    return `https://${input}`;
  } else {
    // Jika input sudah memiliki protokol, coba validasi sebagai URL
    try {
      new URL(input);
      return input; // Jika valid, kembalikan input apa adanya
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Jika tidak valid sebagai URL, tambahkan "https://"
      console.log("err", error);
      return `https://${input.replace(protocolRegex, "")}`;
    }
  }
}
