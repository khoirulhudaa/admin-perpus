import { SERVICE_ENDPOINTS } from "@/core/configs/app";
import { SlimsTodayVisitor, SlimsVisitorStats } from "../models/slims";

export const slimsService = {
  async getVisitorStats(baseUrl: string, start: string, end: string): Promise<SlimsVisitorStats> {
    const url = `${baseUrl}${SERVICE_ENDPOINTS.library.vistor}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start_date: start,
        end_date: end,
      }),
    });

    if (!response.ok) {
      throw new Error("Gagal melakukan fetch data dari SLiMS.");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error("Gagal mengambil statistik pengunjung dari SLiMS.");
    }

    return result.data as SlimsVisitorStats;
  },

async getTodayVisitors(baseUrl: string): Promise<SlimsTodayVisitor> {
    const url = `${baseUrl}${SERVICE_ENDPOINTS.library.vistor}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error("Gagal mengambil data visitor hari ini dari SLiMS.");

    const result = await response.json();
    if (!result.success) throw new Error("Response dari SLiMS tidak sukses.");

    return result.data as SlimsTodayVisitor;
  },
};
