import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import EmployeeManager from "../containers/struktur-main";

export const StrukturORGLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("organization")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("organization"),
          url: "/pegawai",
        },
      ]}
      title={lang.text("organization")}
    >
      <EmployeeManager />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
