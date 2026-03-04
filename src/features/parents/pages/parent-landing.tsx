import { lang } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { DashboardPageLayout } from "@/features/_global";
import { ParentTable } from "../containers";

export const ParentLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("parent")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("parent"),
          url: "/parents",
        },
      ]}
      title={lang.text("parent")}
    >
      <ParentTable />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
