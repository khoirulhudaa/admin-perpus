export type PerpusSource = "slims" | "inslite";

export const resolveSource = (url: string | null): PerpusSource => {
  if (!url) return "inslite";

  try {
    const hostname = new URL(url).hostname;
    if (hostname.includes("inlislite") || /^\d/.test(hostname)) {
      return "inslite";
    }
    return "slims";
  } catch (e) {
    console.error("Gagal parsing URL:", url);
    return "inslite";
  }
};