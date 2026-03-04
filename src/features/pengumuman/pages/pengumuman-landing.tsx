import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import PengumumanPage from "../containers/pengumuman-main";

export const PengumumanLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("pengumuman")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("pengumuman"),
          url: "/calendar",
        },
      ]}
      title={lang.text("pengumuman")}
    >
      <PengumumanPage />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
