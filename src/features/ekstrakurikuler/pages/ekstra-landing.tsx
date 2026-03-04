import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { Ekstrakurikuler } from "../containers";

export const EkstraLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("ekstra")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("ekstra"),
          url: "/ekstrakurikuler",
        },
      ]}
      title={lang.text("ekstra")}
    >
      <Ekstrakurikuler />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
