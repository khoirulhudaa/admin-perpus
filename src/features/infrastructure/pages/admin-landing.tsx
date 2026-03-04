import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import InfraMain from "../containers/admin-table";

export const InfraLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("asset")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("asset"),
          url: "/admin/users",
        },
      ]}
      title={lang.text("asset")}
    >
      <InfraMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
