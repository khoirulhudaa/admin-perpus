import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { TUMain } from "../containers";

export const TULanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("TU")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("TU"),
          url: "/admin/users",
        },
      ]}
      title={lang.text("TU")}
    >
      <TUMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
