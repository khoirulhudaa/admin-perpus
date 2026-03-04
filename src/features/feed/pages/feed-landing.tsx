import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { FeedMain } from "../containers";

export const FeedLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("feed")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("feed"),
          url: "/feed",
        },
      ]}
      title={lang.text("feed")}
    >
      <FeedMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
