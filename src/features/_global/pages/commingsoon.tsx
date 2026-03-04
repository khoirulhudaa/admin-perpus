import { DashboardEmptyData, DashboardPageLayout } from "../components";

export const CommingSoonPage = () => {
  return (
    <DashboardPageLayout>
      <DashboardEmptyData
        title="Halaman Belum Tersedia"
        description="Sistem kami sedang bekerja keras untuk menyediakan fitur di halaman ini."
        actionTitle="Kembali"
      />
    </DashboardPageLayout>
  );
};
