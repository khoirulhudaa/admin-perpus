import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { LayananMain } from "../containers";

export const LayananLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("layanan")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("layanan"),
          url: "/layanan",
        },
      ]}
      title={lang.text("layanan")}
    >
      <LayananMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
