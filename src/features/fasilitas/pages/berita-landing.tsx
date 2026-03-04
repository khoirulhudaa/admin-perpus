import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import FasilitasMain from "../containers/fasilitas-main";

export const FasilitasLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("facility")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("facility"),
          url: "/calendar",
        },
      ]}
      title={lang.text("facility")}
    >
      <FasilitasMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
