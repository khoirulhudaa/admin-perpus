import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import BeritaPage from "../containers/berita-main";

export const BeritaLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("berita")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("berita"),
          url: "/calendar",
        },
      ]}
      title={lang.text("berita")}
    >
      <BeritaPage />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};
