import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { Beranda } from "../containers";

export const SliderLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("slider")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("slider"),
          url: "/slider",
        },
      ]}
      title={lang.text("slider")}
    >
      <Beranda />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
