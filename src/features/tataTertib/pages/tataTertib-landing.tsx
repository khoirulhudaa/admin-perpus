import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { TataTertibMain } from "../containers";

export const TataTertibLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("rules")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("rules"),
          url: "/tata-tertib",
        },
      ]}
      title={lang.text("rules")}
    >
      <TataTertibMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
