import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import Kurikulum from "../containers/admin-table";

export const CurriculumLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("kurikulum")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("kurikulum"),
          url: "/curriculum",
        },
      ]}
      title={lang.text("kurikulum")}
    >
      <Kurikulum />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
