import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { OsisMain } from "../containers";

export const OsisLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("osis")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("osis"),
          url: "/osis",
        },
      ]}
      title={lang.text("osis")}
    >
      <OsisMain />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
