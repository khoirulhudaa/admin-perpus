import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { GaleriMain } from "../containers";

export const GaleriLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("galeri")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("galeri"),
          url: "/galeri",
        },
      ]}
      title={lang.text("galeri")}
    >
      <GaleriMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
