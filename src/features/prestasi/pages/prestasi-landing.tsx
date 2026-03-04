import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { Prestasi } from "../containers";

export const PrestasiLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("prestasi")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("prestasi"),
          url: "/prestasi",
        },
      ]}
      title={lang.text("prestasi")}
    >
      <Prestasi />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
