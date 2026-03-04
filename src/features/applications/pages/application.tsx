import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import ApplicationExpresensiLanding from "../container/applicationXpresensi";

export const ApplicationLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("toolsOtherTitle")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("toolsOtherTitle"),
          url: "/application-other",
        },
      ]}
      title={lang.text("toolsOtherTitle")}
    >
      <ApplicationExpresensiLanding />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
