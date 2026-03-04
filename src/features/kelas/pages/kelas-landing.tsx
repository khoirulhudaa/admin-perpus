import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import KelasMain from "../containers/kelas-main";

export const KelasLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("class")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("class"),
          url: "/calendar",
        },
      ]}
      title={lang.text("class")}
    >
      <KelasMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
