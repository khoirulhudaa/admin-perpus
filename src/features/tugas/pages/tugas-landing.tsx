import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import TugasMain from "../containers/tugas-main";

export const TugasLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("tugas")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("tugas"),
          url: "/pekerjaan-rumah",
        },
      ]}
      title={lang.text("tugas")}
    >
      <TugasMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
