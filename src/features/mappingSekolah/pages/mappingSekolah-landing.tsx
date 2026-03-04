import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { SchoolManagementDashboard } from "../containers/mappingSekolah-main";

export const MappingSekolahLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("statistik")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("statistik"),
          url: "/sebaran-sekolah",
        },
      ]}
      title={lang.text("statistik")}
    >
      <SchoolManagementDashboard />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
