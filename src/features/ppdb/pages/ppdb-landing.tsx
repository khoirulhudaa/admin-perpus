import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import PPDBManager from "../containers/ppdb-main";

export const PPDBLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("ppdb")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("ppdb"),
          url: "/ppdb",
        },
      ]}
      title={lang.text("ppdb")}
    >
      <PPDBManager />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
