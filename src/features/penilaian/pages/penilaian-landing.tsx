import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import KomentarMain from "../containers/penilaian-main";

export const PenilaianLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("rating")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("rating"),
          url: "/calendar",
        },
      ]}
      title={lang.text("rating")}
    >
      <KomentarMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
