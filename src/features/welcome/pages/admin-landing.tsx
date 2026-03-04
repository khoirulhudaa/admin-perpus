import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { Sambutan } from "../containers";

export const WelcomeLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("welcome")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("welcome"),
          url: "/welcome",
        },
      ]}
      title={lang.text("welcome")}
    >
      <Sambutan />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
