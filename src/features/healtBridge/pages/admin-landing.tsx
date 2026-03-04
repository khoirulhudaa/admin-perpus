import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { HealtBridge } from "../containers";

export const HealtBridgeLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("healt")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("healt"),
          url: "/healt-bridge",
        },
      ]}
      title={lang.text("healt")}
    >
      <HealtBridge />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
