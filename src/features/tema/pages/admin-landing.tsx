import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { TemaMain } from "../containers";

export const TemaLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("tema")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("tema"),
          url: "/tema",
        },
      ]}
      title={lang.text("tema")}
    >
      <TemaMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
