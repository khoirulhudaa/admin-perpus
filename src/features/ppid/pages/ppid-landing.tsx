import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { PPIDMain } from "../containers";

export const PPIDLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("ppid")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("ppid"),
          url: "/ppid",
        },
      ]}
      title={lang.text("ppid")}
    >
      <PPIDMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
