import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { VisiMisi } from "../containers";

export const VisiMisiLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("visionMission")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("visionMission"),
          url: "/visiMission",
        },
      ]}
      title={lang.text("visionMission")}
    >
      <VisiMisi />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
