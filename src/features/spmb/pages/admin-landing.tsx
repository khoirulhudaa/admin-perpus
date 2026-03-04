import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { SPMBMain } from "../containers";

export const SPMBLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("spmb")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("spmb"),
          url: "/spmb",
        },
      ]}
      title={lang.text("spmb")}
    >
      <SPMBMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
